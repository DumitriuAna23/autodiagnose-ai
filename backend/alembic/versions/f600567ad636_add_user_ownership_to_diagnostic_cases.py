"""add user ownership to diagnostic cases

Revision ID: f600567ad636
Revises: 655ac16808f7
Create Date: 2026-09-14 17:55:36.968165
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f600567ad636"
down_revision: Union[str, Sequence[str], None] = "655ac16808f7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "diagnostic_cases",
        sa.Column(
            "user_id",
            sa.Uuid(as_uuid=False),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_diagnostic_cases_user_id",
        "diagnostic_cases",
        ["user_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_diagnostic_cases_user_id_users",
        "diagnostic_cases",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_diagnostic_cases_user_id_users",
        "diagnostic_cases",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_diagnostic_cases_user_id",
        table_name="diagnostic_cases",
    )

    op.drop_column(
        "diagnostic_cases",
        "user_id",
    )