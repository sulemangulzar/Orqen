from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID


async def process_document_background(document_id: UUID):
    from app.ai.ingestion import extract_text, index_document
    from app.core.database import get_session_factory
    from app.models.document import Document, DocumentVersion

    async with get_session_factory()() as session:
        document = await session.get(Document, document_id)
        if document is None:
            return
        try:
            document.state = "processing"
            session.add(document)
            await session.commit()
            content = Path(document.storage_key).read_bytes()
            text = extract_text(document.filename, document.mime_type, content)
            chunk_count = await index_document(document.organization_id, document.id, document.filename, text)
            document.state = "indexed"
            document.updated_at = datetime.now(timezone.utc)
            session.add(DocumentVersion(document_id=document.id, checksum=document.checksum, parser_status="complete", chunk_count=chunk_count))
        except Exception as exc:
            document.state = "failed"
            document.error_message = str(exc)[:2000]
            document.updated_at = datetime.now(timezone.utc)
        session.add(document)
        await session.commit()
