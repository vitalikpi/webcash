import math
import threading
from contextlib import asynccontextmanager
from typing import Optional

import gnucash
from gnucash import SessionOpenMode
from fastapi import FastAPI
from pydantic import BaseModel

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


class AccountNode(BaseModel):
    id: str
    name: str
    color: Optional[str]
    hidden: bool
    placeholder: bool
    commodity: Optional[str]
    children: list["AccountNode"] = []


def _commodity_str(commodity) -> Optional[str]:
    if commodity is None:
        return None
    namespace = commodity.get_namespace()
    mnemonic = commodity.get_mnemonic()
    fraction = commodity.get_fraction()
    precision = int(math.log10(fraction)) if fraction > 1 else 0
    return f"{namespace}:{mnemonic}:{precision}"


def _build_account_node(account) -> AccountNode:
    guid = account.GetGUID().to_string()
    name = account.GetName()
    color = account.GetColor() or None
    hidden = bool(account.GetHidden())
    placeholder = bool(account.GetPlaceholder())
    commodity = _commodity_str(account.GetCommodity())
    children = [_build_account_node(child) for child in account.get_children() or []]
    return AccountNode(
        id=guid,
        name=name,
        color=color,
        hidden=hidden,
        placeholder=placeholder,
        commodity=commodity,
        children=children,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/accounts", response_model=list[AccountNode])
def list_accounts():
    with _lock:
        root = _session.get_book().get_root_account()
        return [_build_account_node(child) for child in root.get_children() or []]
