"""Recover missing revision

Revision ID: d5a668b9d627
Revises: 03908fb0de4e
Create Date: 2026-09-29 00:00:00.000000

"""
from typing import Sequence, Union


revision: str = "d5a668b9d627"
down_revision: Union[str, Sequence[str], None] = "03908fb0de4e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
