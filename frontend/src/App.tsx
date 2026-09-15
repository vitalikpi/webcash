import { Route, Routes } from 'react-router-dom'
import { AccountTree } from './components/AccountTree'
import { accounts } from './data/accounts'

function AccountView() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
      Select an account
    </div>
  )
}

export default function App() {
  return (
    <div className="flex h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
          <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            webcash
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <AccountTree accounts={accounts} />
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<AccountView />} />
          <Route path="/accounts/:id" element={<AccountView />} />
        </Routes>
      </main>
    </div>
  )
}
