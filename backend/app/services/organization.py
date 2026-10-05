import re
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.models.enums import UserRole
from app.models.organization import Organization
from app.models.user import User
from app.repositories.organization import OrganizationRepository
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


def make_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    if not slug:
        raise HTTPException(status_code=400, detail="Organization name must contain letters or numbers")
    return slug[:150]


async def make_unique_slug(repository: OrganizationRepository, name: str) -> str:
    base = make_slug(name)
    candidate = base
    suffix = 2
    while await repository.get_by_slug(candidate):
        suffix_text = f"-{suffix}"
        candidate = f"{base[:150 - len(suffix_text)]}{suffix_text}"
        suffix += 1
    return candidate


class OrganizationService:
    def __init__(self, repository: OrganizationRepository) -> None:
        self.repository = repository

    async def create(self, payload: OrganizationCreate, user: User) -> Organization:
        if user.organization_id is not None:
            raise HTTPException(status_code=409, detail="User already belongs to an organization")

        slug = await make_unique_slug(self.repository, payload.name)

        organization = Organization(
            name=payload.name.strip(),
            slug=slug,
            website=payload.website,
            company_size=payload.company_size,
        )
        try:
            organization = await self.repository.create(organization)
            user.organization_id = organization.id
            user.role = UserRole.OWNER
            user.updated_at = datetime.now(timezone.utc)
            self.repository.session.add(user)
            await self.repository.session.commit()
            await self.repository.session.refresh(organization)
            return organization
        except IntegrityError as exc:
            await self.repository.session.rollback()
            raise HTTPException(status_code=409, detail="Organization slug is already in use") from exc

    async def update(self, organization: Organization, payload: OrganizationUpdate, user: User) -> Organization:
        if user.role not in {UserRole.OWNER, UserRole.ADMIN}:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

        values = payload.model_dump(exclude_unset=True)
        if "slug" in values and values["slug"] is not None:
            values["slug"] = make_slug(values["slug"])
            existing = await self.repository.get_by_slug(values["slug"])
            if existing is not None and existing.id != organization.id:
                raise HTTPException(status_code=409, detail="Organization slug is already in use")
        for key, value in values.items():
            setattr(organization, key, value.strip() if isinstance(value, str) else value)
        organization.updated_at = datetime.now(timezone.utc)
        await self.repository.save(organization)
        await self.repository.session.commit()
        return organization
