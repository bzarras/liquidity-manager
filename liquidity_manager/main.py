from fastapi import FastAPI
from liquidity_manager.routers import orders

app = FastAPI()


@app.get("/")
def health_check():
    return {"status": "ok"}

app.include_router(orders.router, prefix="/v1/orders")
