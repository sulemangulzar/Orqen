from uuid import UUID

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.organization import Organization


class OrganizationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, organization_id: UUID) -> Organization | None:
        return await self.session.get(Organization, organization_id)

    async def get_by_slug(self, slug: str) -> Organization | None:
        result = await self.session.exec(
            select(Organization).where(Organization.slug == slug)
        )
        return result.first()

    async def create(self, organization: Organization) -> Organization:
        self.session.add(organization)
        await self.session.flush()
        await self.session.refresh(organization)
        return organization

    async def save(self, organization: Organization) -> Organization:
        self.session.add(organization)
        await self.session.flush()
        await self.session.refresh(organization)
        return organization
