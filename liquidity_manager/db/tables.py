import datetime
from sqlalchemy import Enum, TIMESTAMP
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from liquidity_manager.db.types import OrderStatus, OrderType, Maturity


def _utc_now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc)


class Base(DeclarativeBase):
    pass


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    maturity: Mapped[Maturity] = mapped_column(Enum(Maturity, native_enum=False))
    amount_usd: Mapped[int]
    order_type: Mapped[OrderType] = mapped_column(Enum(OrderType, native_enum=False))
    order_status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, native_enum=False), default=OrderStatus.OPEN
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        TIMESTAMP(timezone=True), insert_default=_utc_now
    )
    deleted_at: Mapped[datetime.datetime | None] = mapped_column(
        TIMESTAMP(timezone=True)
    )
