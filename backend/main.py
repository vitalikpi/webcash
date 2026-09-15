import threading
from contextlib import asynccontextmanager

import gnucash
from gnucash import SessionOpenMode
from fastapi import FastAPI

GNC_FILE = "sqlite3:///data/books.gnucash"

_lock = threading.Lock()
_session: gnucash.Session | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _session
    try:
        _session = gnucash.Session(GNC_FILE, SessionOpenMode.SESSION_BREAK_LOCK)
    except gnucash.GnuCashBackendException as e:
        if gnucash.ERR_FILEIO_FILE_NOT_FOUND in e.errors:
            _session = gnucash.Session(GNC_FILE, SessionOpenMode.SESSION_NEW_STORE)
        else:
            raise
    try:
        yield
    finally:
        if _session is not None:
            _session.end()
            _session.destroy()
            _session = None


app = FastAPI(title="Webcash API", version="0.1.0", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "ok"}
