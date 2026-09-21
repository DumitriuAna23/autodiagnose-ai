"""create guest sessions

Revision ID: fc1fed1f1e1c
Revises: f600567ad636
Create Date: 2026-09-14 18:18:44.745323
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fc1fed1f1e1c"
down_revision: Union[str, Sequence[str], None] = "f600567ad636"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "guest_sessions",
        sa.Column(
            "id",
            sa.Uuid(as_uuid=False),
            nullable=False,
        ),
        sa.Column(
            "token_hash",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "expires_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_guest_sessions_token_hash",
        "guest_sessions",
        ["token_hash"],
        unique=True,
    )

    op.add_column(
        "diagnostic_cases",
        sa.Column(
            "guest_session_id",
            sa.Uuid(as_uuid=False),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_diagnostic_cases_guest_session_id",
        "diagnostic_cases",
        ["guest_session_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_diagnostic_cases_guest_session_id_guest_sessions",
        "diagnostic_cases",
        "guest_sessions",
        ["guest_session_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_diagnostic_cases_guest_session_id_guest_sessions",
        "diagnostic_cases",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_diagnostic_cases_guest_session_id",
        table_name="diagnostic_cases",
    )

    op.drop_column(
        "diagnostic_cases",
        "guest_session_id",
    )

    op.drop_index(
        "ix_guest_sessions_token_hash",
        table_name="guest_sessions",
    )

    op.drop_table(
        "guest_sessions"
    )