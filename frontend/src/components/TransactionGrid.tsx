import { useEffect, useState } from 'react'
import { type Transaction, fetchTransactions } from '../data/transactions'

function formatAmount(num: number, denom: number): string {
  return (num / denom).toFixed(Math.round(Math.log10(denom)))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const RECONCILE_LABEL: Record<string, string> = {
  y: 'Reconciled',
  c: 'Cleared',
  n: 'Uncleared',
}

function ReconcileBadge({ state }: { state: string }) {
  const colours: Record<string, string> = {
    y: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    c: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    n: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${colours[state] ?? colours.n}`}>
      {RECONCILE_LABEL[state] ?? state}
    </span>
  )
}

export function TransactionGrid({ accountId }: { accountId: string }) {
  const [rows, setRows] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchTransactions(accountId)
      .then(setRows)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [accountId])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-red-500">
        {error}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
        No transactions
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-white dark:bg-zinc-950">
          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Memo</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-right">Balance</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(tx => {
            const split = tx.splits.find(s => s.account_id === accountId)
            if (!split) return null
            const amount = split.value_num / split.value_denom
            const balance = split.balance_num / split.balance_denom
            const precision = Math.round(Math.log10(split.value_denom))
            return (
              <tr
                key={tx.id}
                className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <td className="whitespace-nowrap px-4 py-2 text-zinc-500 dark:text-zinc-400">
                  {formatDate(tx.post_date)}
                </td>
                <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                  {tx.description || <span className="text-zinc-400">—</span>}
                </td>
                <td className="px-4 py-2 text-zinc-500 dark:text-zinc-400">
                  {split.memo || <span className="text-zinc-300 dark:text-zinc-600">—</span>}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-2 text-right font-mono ${
                    amount < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {amount >= 0 ? '+' : ''}
                  {amount.toFixed(precision)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-right font-mono text-zinc-700 dark:text-zinc-300">
                  {balance.toFixed(precision)}
                </td>
                <td className="px-4 py-2">
                  <ReconcileBadge state={split.reconcile_state} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
