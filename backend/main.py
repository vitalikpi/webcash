import math
import threading
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

import gnucash
from gnucash import SessionOpenMode, Split as GncSplit
from fastapi import FastAPI, HTTPException
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


class SplitOut(BaseModel):
    id: str
    transaction_id: str
    account_id: str
    memo: str
    action: str
    reconcile_state: str
    reconcile_date: Optional[datetime]
    value_num: int
    value_denom: int
    quantity_num: int
    quantity_denom: int
    balance_num: int
    balance_denom: int
    lot_id: Optional[str]


class TransactionOut(BaseModel):
    id: str
    enter_date: Optional[datetime]
    post_date: datetime
    notes: Optional[str]
    description: Optional[str]
    number: str
    currency: Optional[str]
    splits: list[SplitOut]


def _time64_to_datetime(t) -> Optional[datetime]:
    if t is None:
        return None
    try:
        # time64 is a unix timestamp (int); datetime objects also accepted
        if isinstance(t, (int, float)):
            if t == 0:
                return None
            return datetime.fromtimestamp(t, tz=timezone.utc)
        return t.replace(tzinfo=timezone.utc) if t.tzinfo is None else t
    except Exception:
        return None


def _build_split(split) -> SplitOut:
    if not isinstance(split, GncSplit):
        split = GncSplit(instance=split)
    value = split.GetValue()
    quantity = split.GetAmount()
    balance = split.GetBalance()
    reconcile_date = _time64_to_datetime(split.GetDateReconciled())
    lot_id = None
    try:
        lot = split.GetLot()
        if lot is not None:
            lot_id = lot.GetGUID().to_string()
    except Exception:
        pass
    return SplitOut(
        id=split.GetGUID().to_string(),
        transaction_id=split.GetParent().GetGUID().to_string(),
        account_id=split.GetAccount().GetGUID().to_string(),
        memo=split.GetMemo() or "",
        action=split.GetAction() or "",
        reconcile_state=split.GetReconcile(),
        reconcile_date=reconcile_date if (reconcile_date and reconcile_date.year > 1970) else None,
        value_num=value.num(),
        value_denom=value.denom(),
        quantity_num=quantity.num(),
        quantity_denom=quantity.denom(),
        balance_num=balance.num(),
        balance_denom=balance.denom(),
        lot_id=lot_id,
    )


def _build_transaction(txn) -> TransactionOut:
    splits = []
    for s in txn.GetSplitList():
        splits.append(_build_split(s))
    return TransactionOut(
        id=txn.GetGUID().to_string(),
        enter_date=_time64_to_datetime(txn.GetDateEntered()),
        post_date=_time64_to_datetime(txn.GetDate()),
        notes=txn.GetNotes() or None,
        description=txn.GetDescription() or None,
        number=txn.GetNum() or "",
        currency=_commodity_str(txn.GetCurrency()),
        splits=splits,
    )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/accounts", response_model=list[AccountNode])
def list_accounts():
    with _lock:
        root = _session.get_book().get_root_account()
        return [_build_account_node(child) for child in root.get_children() or []]


@app.get("/accounts/{account_id}/transactions", response_model=list[TransactionOut])
def list_account_transactions(account_id: str):
    with _lock:
        book = _session.get_book()
        guid = gnucash.gnucash_core.GUID()
        gnucash.gnucash_core.GUIDString(account_id, guid)
        account = guid.AccountLookup(book)
        if account is None:
            raise HTTPException(status_code=404, detail="Account not found")
        transactions = []
        for split in account.GetSplitList() or []:
            if not isinstance(split, GncSplit):
                split = GncSplit(instance=split)
            transactions.append(_build_transaction(split.GetParent()))
        transactions.sort(key=lambda t: t.post_date)
        return transactions
