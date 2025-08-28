from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from liquidity_manager.db import tables
from liquidity_manager.db.config import get_async_session
from liquidity_manager.models.orders import Order, OrderCreate, Orders

router = APIRouter(tags=["Orders"])


@router.get("/")
async def get_orders(
    limit: int = 10, session: AsyncSession = Depends(get_async_session)
) -> Orders:
    stmt = (
        select(tables.Order)
        .order_by(desc(tables.Order.created_at))
        .limit(limit if limit > 0 else None)
    )
    result = await session.scalars(stmt)
    orders = [Order.model_validate(r) for r in result]
    return Orders(orders=orders, count=len(orders))


@router.post("/")
async def create_order(
    order_info: OrderCreate, session: AsyncSession = Depends(get_async_session)
) -> Order:
    order = tables.Order(
        maturity=order_info.maturity,
        amount_usd=order_info.amount_usd,
        order_type=order_info.order_type,
    )
    session.add(order)
    await session.commit()
    await session.refresh(order)
    return Order(
        id=order.id,
        maturity=order.maturity,
        amount_usd=order.amount_usd,
        order_type=order.order_type,
        order_status=order.order_status,
        created_at=order.created_at,
    )
