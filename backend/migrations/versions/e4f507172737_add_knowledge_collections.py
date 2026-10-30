"""Add knowledge collections."""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "e4f507172737"
down_revision: Union[str, Sequence[str], None] = "d9e3f4061626"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("knowledge_collections",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("organization_id", sa.Uuid(), sa.ForeignKey("organizations.id"), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("slug", sa.String(length=150), nullable=False),
        sa.Column("namespace", sa.String(length=150), nullable=False, unique=True),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_knowledge_collections_organization_id", "knowledge_collections", ["organization_id"])
    op.create_index("ix_knowledge_collections_slug", "knowledge_collections", ["slug"])


def downgrade() -> None:
    op.drop_index("ix_knowledge_collections_slug", table_name="knowledge_collections")
    op.drop_index("ix_knowledge_collections_organization_id", table_name="knowledge_collections")
    op.drop_table("knowledge_collections")
