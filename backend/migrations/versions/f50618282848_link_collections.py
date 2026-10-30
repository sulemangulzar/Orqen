"""Link documents and assistants to knowledge collections."""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "f50618282848"
down_revision: Union[str, Sequence[str], None] = "e4f507172737"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("documents", sa.Column("collection_id", sa.Uuid(), sa.ForeignKey("knowledge_collections.id"), nullable=True))
    op.create_index("ix_documents_collection_id", "documents", ["collection_id"])
    op.add_column("assistants", sa.Column("collection_id", sa.Uuid(), sa.ForeignKey("knowledge_collections.id"), nullable=True))
    op.create_index("ix_assistants_collection_id", "assistants", ["collection_id"])


def downgrade() -> None:
    op.drop_index("ix_assistants_collection_id", table_name="assistants")
    op.drop_column("assistants", "collection_id")
    op.drop_index("ix_documents_collection_id", table_name="documents")
    op.drop_column("documents", "collection_id")
