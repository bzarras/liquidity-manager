from fastapi import APIRouter

router = APIRouter(tags=["Orders"])


@router.get("/")
async def get_orders():
    return {"orders": []}


@router.post("/")
async def create_order():
    pass
