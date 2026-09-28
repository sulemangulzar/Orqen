import uuid
from fastapi import APIRouter

router = APIRouter(tags=["Users"], prefix="/users")


@router.patch("/{user_id}")
async def update_user(user_id: uuid.UUID):
  """Partial update for user profile attributes."""
  pass


@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID):
  """Soft-delete or remove a user from the organization."""
  pass

@router.post("/invitations/accept")
async def accept_invite(user_id: uuid.UUID):
  pass
