import hashlib
from pathlib import Path
from uuid import UUID

from app.core.config import settings
from app.ai.pinecone_utils import index_name


def extract_text(filename: str, mime_type: str, content: bytes) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix in {".txt", ".md", ".csv", ".json"} or mime_type.startswith("text/"):
        return content.decode("utf-8", errors="replace")
    if suffix == ".pdf" or mime_type == "application/pdf":
        from io import BytesIO
        from pypdf import PdfReader
        return "\n\n".join(page.extract_text() or "" for page in PdfReader(BytesIO(content)).pages)
    raise ValueError("Unsupported file type. Upload PDF, TXT, Markdown, CSV, or JSON.")


def split_text(text: str) -> list[str]:
    try:
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        return [chunk for chunk in RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150).split_text(text) if chunk.strip()]
    except ImportError:
        # Keep local uploads usable if the optional LangChain splitter is not
        # present in an older running environment.
        chunks = []
        step = 850
        overlap = 150
        for start in range(0, len(text), step):
            chunk = text[max(0, start - overlap):start + step]
            if chunk.strip():
                chunks.append(chunk)
        return chunks


async def index_document(organization_id: UUID, document_id: UUID, filename: str, text: str) -> int:
    if not settings.pinecone_api_key or not settings.pinecone_collection or not settings.openai_api_key:
        raise RuntimeError("OpenAI and Pinecone configuration is required to index documents")
    from langchain_core.documents import Document as LangDocument
    from langchain_openai import OpenAIEmbeddings
    from langchain_pinecone import PineconeVectorStore
    from pinecone import Pinecone
    chunks = split_text(text)
    if not chunks:
        raise ValueError("The uploaded document does not contain readable text")
    pinecone = Pinecone(api_key=settings.pinecone_api_key)
    pinecone_index_name = index_name(settings.pinecone_collection)
    if not pinecone.has_index(pinecone_index_name):
        from pinecone import ServerlessSpec
        pinecone.create_index(name=pinecone_index_name, dimension=1536, metric="cosine", spec=ServerlessSpec(cloud="aws", region="us-east-1"))
    store = PineconeVectorStore(index=pinecone.Index(pinecone_index_name), embedding=OpenAIEmbeddings(model=settings.openai_embedding_model, api_key=settings.openai_api_key), namespace=str(organization_id))
    documents = [LangDocument(page_content=chunk, metadata={"document_id": str(document_id), "filename": filename, "organization_id": str(organization_id), "chunk_index": index}) for index, chunk in enumerate(chunks)]
    await store.aadd_documents(documents)
    return len(chunks)


def checksum(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()
