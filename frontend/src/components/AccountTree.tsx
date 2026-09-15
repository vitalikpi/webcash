import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { type Account } from '../data/accounts'

function AccountNode({ account, depth }: { account: Account; depth: number }) {
  const [open, setOpen] = useState(depth < 1)
  const hasChildren = account.children && account.children.length > 0

  return (
    <li>
      <div
        className="flex items-center gap-1 rounded px-2 py-0.5 text-sm"
        style={{ paddingLeft: `${0.5 + depth * 0.875}rem` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setOpen(o => !o)}
            className="w-3 shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <NavLink
          to={`/accounts/${account.id}`}
          className={({ isActive }) =>
            `flex flex-1 items-center gap-1.5 truncate py-0.5 hover:text-zinc-900 dark:hover:text-zinc-100 ${
              isActive
                ? 'font-medium text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`
          }
        >
          {account.color && (
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: account.color }}
            />
          )}
          <span className="truncate">{account.name}</span>
        </NavLink>
      </div>

      {hasChildren && open && (
        <ul>
          {account.children!.map(child => (
            <AccountNode key={child.id} account={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export function AccountTree({ accounts }: { accounts: Account[] }) {
  return (
    <nav className="select-none">
      <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Accounts
      </p>
      <ul>
        {accounts.map(account => (
          <AccountNode key={account.id} account={account} depth={0} />
        ))}
      </ul>
    </nav>
  )
}
