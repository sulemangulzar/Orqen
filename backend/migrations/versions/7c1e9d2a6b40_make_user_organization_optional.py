"""Make user organization optional

Revision ID: 7c1e9d2a6b40
Revises: 03908fb0de4e
Create Date: 2026-09-28 12:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7c1e9d2a6b40"
down_revision: Union[str, Sequence[str], None] = "d5a668b9d627"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=True,
    )


def downgrade() -> None:
    op.alter_column(
        "users",
        "organization_id",
        existing_type=sa.Uuid(),
        nullable=False,
    )
