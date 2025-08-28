from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from liquidity_manager.routers import orders

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok"}


app.include_router(orders.router, prefix="/v1/orders")
