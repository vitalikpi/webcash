export interface Split {
  id: string
  transaction_id: string
  account_id: string
  memo: string
  action: string
  reconcile_state: string
  reconcile_date: string | null
  value_num: number
  value_denom: number
  quantity_num: number
  quantity_denom: number
  balance_num: number
  balance_denom: number
  lot_id: string | null
}

export interface Transaction {
  id: string
  enter_date: string
  post_date: string
  notes: string | null
  description: string
  number: string
  currency: string
  splits: Split[]
}

export async function fetchTransactions(accountId: string): Promise<Transaction[]> {
  const res = await fetch(`/api/accounts/${accountId}/transactions`)
  if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`)
  return res.json()
}
