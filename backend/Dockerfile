FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gnucash \
        python3-gnucash \
        libdbd-sqlite3 \
        python3-pip && \
    rm -rf /var/lib/apt/lists/*

# Verify GnuCash Python bindings work at build time
RUN python3 -c "import gnucash; print('OK')"
RUN python3 -c "from gnucash import Session, SessionOpenMode; s = Session('sqlite3:///tmp/t.gnucash', SessionOpenMode.SESSION_NEW_STORE); s.save(); s.end(); s.destroy(); print('SQLite OK')"

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY main.py .

RUN mkdir -p /data

EXPOSE 8000

CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
