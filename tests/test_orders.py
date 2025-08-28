import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_orders_empty(client: AsyncClient):
    response = await client.get("/v1/orders/")
    assert response.status_code == 200
    data = response.json()
    assert data["orders"] == []
    assert data["count"] == 0


@pytest.mark.asyncio
async def test_create_order(client: AsyncClient):
    order_data = {"maturity": "1 YEAR", "amount_usd": 1000000, "order_type": "BUY"}

    response = await client.post("/v1/orders/", json=order_data)
    assert response.status_code == 200

    data = response.json()
    assert data["maturity"] == "1 YEAR"
    assert data["amount_usd"] == 1000000
    assert data["order_type"] == "BUY"
    assert data["order_status"] == "OPEN"
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_get_orders_with_data(client: AsyncClient):
    # Create a test order first
    order_data = {"maturity": "2 YEAR", "amount_usd": 500000, "order_type": "SELL"}
    await client.post("/v1/orders/", json=order_data)

    # Get orders
    response = await client.get("/v1/orders/")
    assert response.status_code == 200

    data = response.json()
    assert len(data["orders"]) == 1
    assert data["count"] == 1
    assert data["orders"][0]["maturity"] == "2 YEAR"
    assert data["orders"][0]["amount_usd"] == 500000
    assert data["orders"][0]["order_type"] == "SELL"


@pytest.mark.asyncio
async def test_create_order_invalid_amount(client: AsyncClient):
    order_data = {
        "maturity": "1 YEAR",
        "amount_usd": -1000,  # Invalid negative amount
        "order_type": "BUY",
    }

    response = await client.post("/v1/orders/", json=order_data)
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_get_orders_with_limit(client: AsyncClient):
    # Create multiple test orders
    for i in range(5):
        order_data = {
            "maturity": "1 YEAR",
            "amount_usd": 100000 * (i + 1),
            "order_type": "BUY",
        }
        await client.post("/v1/orders/", json=order_data)

    # Get orders with limit
    response = await client.get("/v1/orders/?limit=3")
    assert response.status_code == 200

    data = response.json()
    assert len(data["orders"]) == 3
    assert data["count"] == 3
