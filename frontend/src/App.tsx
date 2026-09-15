import { useEffect, useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { AccountTree } from './components/AccountTree'
import { TransactionGrid } from './components/TransactionGrid'
import { type Account } from './data/accounts'

async function fetchAccounts(): Promise<Account[]> {
  const res = await fetch('/api/accounts')
  if (!res.ok) throw new Error(`Failed to fetch accounts: ${res.status}`)
  return res.json()
}

function AccountView() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
      Select an account
    </div>
  )
}

function AccountTransactionsView() {
  const { id } = useParams<{ id: string }>()
  return <TransactionGrid accountId={id!} />
}

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .catch(e => setError(e.message))
  }, [])

  return (
    <div className="flex h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            webcash
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <p className="px-3 py-3 text-xs text-red-500">{error}</p>
          ) : (
            <AccountTree accounts={accounts} />
          )}
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<AccountView />} />
          <Route path="/accounts/:id" element={<AccountTransactionsView />} />
        </Routes>
      </main>
    </div>
  )
}
