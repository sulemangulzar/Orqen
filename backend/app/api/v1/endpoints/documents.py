from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile

from app.ai.ingestion import checksum
from app.ai.background import process_document_background
from app.api.deps import SessionDep, get_current_user
from app.core.config import settings
from app.models.document import Document, DocumentVersion
from app.models.collection import KnowledgeCollection
from app.models.enums import UserRole
from app.models.user import User

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=dict, status_code=201)
async def upload_document(background_tasks: BackgroundTasks, session: SessionDep, file: UploadFile = File(...), title: str = Form(...), current_user: User = Depends(get_current_user)):
    if current_user.organization_id is None or current_user.role not in {UserRole.OWNER, UserRole.ADMIN}:
        raise HTTPException(status_code=403, detail="Only organization managers can upload documents")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds the 10 MB limit")
    filename = file.filename or "document"
    title = title.strip()
    if len(title) < 2 or len(title) > 150:
        raise HTTPException(status_code=422, detail="Document title must be between 2 and 150 characters")
    allowed_extensions = {".pdf", ".txt", ".md", ".csv", ".json"}
    if Path(filename).suffix.lower() not in allowed_extensions:
        raise HTTPException(status_code=415, detail="Unsupported file extension")
    document_id = uuid4()
    digest = checksum(content)
    root = Path(settings.document_storage_path) / str(current_user.organization_id)
    root.mkdir(parents=True, exist_ok=True)
    storage_path = root / f"{document_id}-{Path(filename).name}"
    storage_path.write_bytes(content)
    import re
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:100] or "knowledge"
    collection = KnowledgeCollection(organization_id=current_user.organization_id, name=title, slug=f"{slug}-{str(document_id)[:8]}", namespace=f"user-{current_user.id}-{slug}-{str(document_id)[:8]}")
    session.add(collection)
    await session.flush()
    document = Document(id=document_id, organization_id=current_user.organization_id, collection_id=collection.id, uploaded_by=current_user.id, filename=filename, mime_type=file.content_type or "application/octet-stream", storage_key=str(storage_path), checksum=digest, state="queued")
    session.add(document)
    await session.commit()
    background_tasks.add_task(process_document_background, document.id)
    return {"id": str(document.id), "filename": document.filename, "state": document.state, "error_message": document.error_message}
