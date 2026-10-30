"""Add support conversations and messages."""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "c8d2e3f40515"
down_revision: Union[str, Sequence[str], None] = "b7c9d1e2f304"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("conversations",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("organization_id", sa.Uuid(), sa.ForeignKey("organizations.id"), nullable=False),
        sa.Column("assistant_id", sa.Uuid(), sa.ForeignKey("assistants.id"), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("needs_handoff", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_conversations_organization_id", "conversations", ["organization_id"])
    op.create_index("ix_conversations_assistant_id", "conversations", ["assistant_id"])
    op.create_index("ix_conversations_status", "conversations", ["status"])
    op.create_table("conversation_messages",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("conversation_id", sa.Uuid(), sa.ForeignKey("conversations.id"), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("sources", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_conversation_messages_conversation_id", "conversation_messages", ["conversation_id"])


def downgrade() -> None:
    op.drop_index("ix_conversation_messages_conversation_id", table_name="conversation_messages")
    op.drop_table("conversation_messages")
    op.drop_index("ix_conversations_status", table_name="conversations")
    op.drop_index("ix_conversations_assistant_id", table_name="conversations")
    op.drop_index("ix_conversations_organization_id", table_name="conversations")
    op.drop_table("conversations")
