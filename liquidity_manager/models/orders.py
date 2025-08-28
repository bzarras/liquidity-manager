import datetime
from pydantic import BaseModel, ConfigDict, Field

from liquidity_manager.db.types import Maturity, OrderStatus, OrderType


class OrderBase(BaseModel):
    maturity: Maturity
    amount_usd: int = Field(gt=0)
    order_type: OrderType


class OrderCreate(OrderBase):
    pass


class Order(OrderBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    order_status: OrderStatus
    created_at: datetime.datetime


class Orders(BaseModel):
    orders: list[Order]
    count: int
