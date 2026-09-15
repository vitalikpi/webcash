# Webcash

A headless REST API + frontend over GnuCash, running in Docker.

## Structure

- `gnucash/` — GnuCash source tree. **Read-only reference.** Do not modify, commit, or add files here. Use it to look up engine APIs, struct fields, Python binding signatures, and backend behavior.
- `backend/` — Python REST server using GnuCash Python bindings (FastAPI + uvicorn). Runs inside Docker with gnucash installed from distro packages.
- `frontend/` — Web frontend (TBD).

## Backend key facts

- Runtime dependency: `gnucash` Python package installed in Docker image (Ubuntu 24.04, packages: `gnucash python3-gnucash libdbd-sqlite3`)
- GnuCash engine runs **in-process** inside the Python server — no separate GnuCash process, no IPC
- Data stored in SQLite via `Session('sqlite3:///data/books.gnucash')`
- SQLite backend commits per-object on `CommitEdit()` — no need to call `session.save()` after every write
- The engine is **not thread-safe** — all engine calls must be serialized to one thread
- One `Session` per process, held open for the lifetime of the server
- SQLite file lives on a Docker named volume mounted at `/data`

## Scope (backend)

Accounts, transactions, splits, prices, commodities — that's it. No reports, no budgets, no scheduled transactions (those require the Guile layer which is not exposed to Python).

## GnuCash Python binding reference

- `Session`, `Book`, `Account`, `Transaction`, `Split` — `gnucash/bindings/python/gnucash_core.py`
- `GncCommodity`, `GncCommodityTable`, `GncPrice`, `GncPriceDB` — same file
- SWIG interface: `gnucash/bindings/python/gnucash_core.i`
- Example scripts (including an existing Flask REST prototype): `gnucash/bindings/python/example_scripts/`
- Existing REST prototype to reference (not copy verbatim): `gnucash/bindings/python/example_scripts/rest-api/gnucash_rest.py`

## What is NOT available via Python bindings

Do not attempt to implement these — they require the Guile/Scheme layer and are not exposed to Python:

- Reports (driven by `gnc:html-*` Scheme functions)
- Budgets (`gnc-budget.h` not in Python SWIG interface)
- Scheduled transactions (`SX-book.h` not in Python SWIG interface)
- Reconciliation operations
- Import/export (OFX, QIF)
- Preferences (`gnc-prefs.h` not wrapped)

## Docker image

Base: `ubuntu:24.04`
Required packages: `gnucash python3-gnucash libdbd-sqlite3 python3-pip`
Verify bindings work during build:
```
RUN python3 -c "import gnucash; print('OK')"
RUN python3 -c "from gnucash import Session, SessionOpenMode; s = Session('sqlite3:///tmp/t.gnucash', SessionOpenMode.SESSION_NEW_STORE); s.save(); s.end(); s.destroy(); print('SQLite OK')"
```
SQLite file on named volume mounted at `/data`.

## Session lifecycle

```python
import signal, gnucash

session = gnucash.Session('sqlite3:///data/books.gnucash', SessionOpenMode.SESSION_BREAK_LOCK)

def shutdown(sig, frame):
    session.end()
    session.destroy()
    sys.exit(0)

signal.signal(signal.SIGTERM, shutdown)
signal.signal(signal.SIGINT, shutdown)
```

`SESSION_BREAK_LOCK` handles stale lock files left by unclean shutdowns.

## Concurrency model

Single-threaded: one request at a time. Use a threading lock around all engine calls if using a multi-threaded HTTP framework. The GnuCash engine (`QofBook`, `QofSession`) has no internal locking.
