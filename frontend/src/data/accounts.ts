export type AccountType =
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'INCOME'
  | 'EXPENSE'

export interface Account {
  id: string
  name: string
  type: AccountType
  children?: Account[]
}

export const accounts: Account[] = [
  {
    id: 'assets',
    name: 'Assets',
    type: 'ASSET',
    children: [
      {
        id: 'assets:current',
        name: 'Current Assets',
        type: 'ASSET',
        children: [
          { id: 'assets:current:checking', name: 'Checking', type: 'ASSET' },
          { id: 'assets:current:savings', name: 'Savings', type: 'ASSET' },
        ],
      },
      {
        id: 'assets:investments',
        name: 'Investments',
        type: 'ASSET',
        children: [
          { id: 'assets:investments:brokerage', name: 'Brokerage', type: 'ASSET' },
          { id: 'assets:investments:retirement', name: '401(k)', type: 'ASSET' },
        ],
      },
    ],
  },
  {
    id: 'liabilities',
    name: 'Liabilities',
    type: 'LIABILITY',
    children: [
      { id: 'liabilities:credit-card', name: 'Credit Card', type: 'LIABILITY' },
      { id: 'liabilities:mortgage', name: 'Mortgage', type: 'LIABILITY' },
    ],
  },
  {
    id: 'equity',
    name: 'Equity',
    type: 'EQUITY',
    children: [
      { id: 'equity:opening', name: 'Opening Balances', type: 'EQUITY' },
    ],
  },
  {
    id: 'income',
    name: 'Income',
    type: 'INCOME',
    children: [
      { id: 'income:salary', name: 'Salary', type: 'INCOME' },
      { id: 'income:interest', name: 'Interest', type: 'INCOME' },
    ],
  },
  {
    id: 'expenses',
    name: 'Expenses',
    type: 'EXPENSE',
    children: [
      { id: 'expenses:food', name: 'Food & Dining', type: 'EXPENSE' },
      { id: 'expenses:housing', name: 'Housing', type: 'EXPENSE' },
      { id: 'expenses:transport', name: 'Transport', type: 'EXPENSE' },
      { id: 'expenses:utilities', name: 'Utilities', type: 'EXPENSE' },
    ],
  },
]
