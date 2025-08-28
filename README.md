## System Requirements

This project uses the following languages and frameworks:
- Frontend
  - Node.js v22
  - Next.js 15
- Backend
  - Python 3.13
  - uv
  - FastAPI
  - SQLite

It was developed on Apple M2 silicon.

The following section will show you how to set everything up and run the app.

## Getting Started

The following sections assume you are running these commands from within the `liquidity-manager` project directory.

### Backend

This project was built and managed with `uv`. If you don't already have uv installed,
please install it with the following command, or read about alternative installation
methods in [their docs](https://docs.astral.sh/uv/getting-started/installation/).

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Now we can use `uv` to install Python 3.13:

```bash
uv python install 3.13
```

Finally, to install the backend dependencies, run:

```bash
uv sync
```

### Frontend

First, make sure you have install Node.js 22. This is the LTS version, and if you're
using nvm you can run:

```bash
nvm install --lts
```

To install the frontend dependencies, run:

```bash
npm install
```

## Running the project

Start the backend with:

```bash
uv run fastapi dev liquidity_manager/main.py
```

In a separate terminal, start the frontend with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Notes
- Wish I didn't pull in the entire heroUI
- Could run with docker compose, but might be too much work
- Need to mention environment requirements for FE and BE and how to install stuff
- unit tests?
- Talk about database file
- Docker compose?
