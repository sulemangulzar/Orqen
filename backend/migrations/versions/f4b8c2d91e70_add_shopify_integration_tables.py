"""Add Shopify integration tables.

Revision ID: f4b8c2d91e70
Revises: a81d7e3b0c19
Create Date: 2026-10-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


revision: str = "f4b8c2d91e70"
down_revision: Union[str, Sequence[str], None] = "a81d7e3b0c19"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "shopify_connections",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("shop_domain", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("shopify_shop_id", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("access_token_encrypted", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("refresh_token_encrypted", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("access_token_expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("refresh_token_expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("scopes", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("status", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_shopify_connections_id"), "shopify_connections", ["id"], unique=False)
    op.create_index(
        op.f("ix_shopify_connections_organization_id"),
        "shopify_connections",
        ["organization_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_shopify_connections_shop_domain"),
        "shopify_connections",
        ["shop_domain"],
        unique=True,
    )

    op.create_table(
        "shopify_oauth_states",
        sa.Column("state_hash", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("shop_domain", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["organization_id"], ["organizations.id"]),
        sa.PrimaryKeyConstraint("state_hash"),
    )
    op.create_index(
        op.f("ix_shopify_oauth_states_organization_id"),
        "shopify_oauth_states",
        ["organization_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_shopify_oauth_states_organization_id"),
        table_name="shopify_oauth_states",
    )
    op.drop_table("shopify_oauth_states")
    op.drop_index(
        op.f("ix_shopify_connections_shop_domain"),
        table_name="shopify_connections",
    )
    op.drop_index(
        op.f("ix_shopify_connections_organization_id"),
        table_name="shopify_connections",
    )
    op.drop_index(op.f("ix_shopify_connections_id"), table_name="shopify_connections")
    op.drop_table("shopify_connections")
