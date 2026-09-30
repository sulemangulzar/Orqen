"""Complete auth fields

Revision ID: a81d7e3b0c19
Revises: 7c1e9d2a6b40
Create Date: 2026-09-29 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


revision: str = "a81d7e3b0c19"
down_revision: Union[str, Sequence[str], None] = "7c1e9d2a6b40"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "users",
        "hashed_password",
        existing_type=sa.VARCHAR(),
        nullable=True,
    )
    op.add_column(
        "users",
        sa.Column(
            "auth_provider",
            sa.Enum("email", "google", name="auth_provider", native_enum=False),
            nullable=False,
            server_default="email",
        ),
    )
    op.alter_column("users", "auth_provider", server_default=None)
    op.add_column("users", sa.Column("provider_id", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True))
    op.add_column("users", sa.Column("email_verification_token_hash", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True))
    op.add_column("users", sa.Column("email_verification_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("password_reset_token_hash", sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True))
    op.add_column("users", sa.Column("password_reset_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index(op.f("ix_users_provider_id"), "users", ["provider_id"], unique=False)
    op.create_index(op.f("ix_users_email_verification_token_hash"), "users", ["email_verification_token_hash"], unique=False)
    op.create_index(op.f("ix_users_password_reset_token_hash"), "users", ["password_reset_token_hash"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_users_password_reset_token_hash"), table_name="users")
    op.drop_index(op.f("ix_users_email_verification_token_hash"), table_name="users")
    op.drop_index(op.f("ix_users_provider_id"), table_name="users")
    op.drop_column("users", "password_reset_expires_at")
    op.drop_column("users", "password_reset_token_hash")
    op.drop_column("users", "email_verification_expires_at")
    op.drop_column("users", "email_verification_token_hash")
    op.drop_column("users", "provider_id")
    op.drop_column("users", "auth_provider")
    op.alter_column(
        "users",
        "hashed_password",
        existing_type=sa.VARCHAR(),
        nullable=False,
    )
