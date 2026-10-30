"""Add visitor session binding to conversations."""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "d9e3f4061626"
down_revision: Union[str, Sequence[str], None] = "c8d2e3f40515"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("conversations", sa.Column("visitor_session_hash", sa.String(length=128), nullable=True))
    op.create_index("ix_conversations_visitor_session_hash", "conversations", ["visitor_session_hash"])


def downgrade() -> None:
    op.drop_index("ix_conversations_visitor_session_hash", table_name="conversations")
    op.drop_column("conversations", "visitor_session_hash")
