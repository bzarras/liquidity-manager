from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from liquidity_manager.settings import DATABASE_URL

_engine = create_async_engine(DATABASE_URL)

async_session = async_sessionmaker(
    bind=_engine, autoflush=False, expire_on_commit=False
)


async def get_async_session():
    async with async_session() as session:
        yield session
