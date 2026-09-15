export interface Account {
  id: string
  name: string
  color: string | null
  hidden: boolean
  placeholder: boolean
  commodity: string        // "NAMESPACE:MNEMONIC:PRECISION"
  children: Account[]
}

export const accounts: Account[] = [
  {
    id: 'a1',
    name: 'Assets',
    color: null,
    hidden: false,
    placeholder: true,
    commodity: 'CURRENCY:USD:2',
    children: [
      {
        id: 'a2',
        name: 'Current Assets',
        color: null,
        hidden: false,
        placeholder: true,
        commodity: 'CURRENCY:USD:2',
        children: [
          {
            id: 'a3',
            name: 'Checking',
            color: '#4ade80',
            hidden: false,
            placeholder: false,
            commodity: 'CURRENCY:USD:2',
            children: [],
          },
          {
            id: 'a4',
            name: 'Savings',
            color: null,
            hidden: false,
            placeholder: false,
            commodity: 'CURRENCY:USD:2',
            children: [],
          },
        ],
      },
      {
        id: 'a5',
        name: 'Investments',
        color: null,
        hidden: false,
        placeholder: true,
        commodity: 'CURRENCY:USD:2',
        children: [
          {
            id: 'a6',
            name: 'Brokerage',
            color: '#60a5fa',
            hidden: false,
            placeholder: false,
            commodity: 'FUND:VTSAX:4',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'b1',
    name: 'Liabilities',
    color: null,
    hidden: false,
    placeholder: true,
    commodity: 'CURRENCY:USD:2',
    children: [
      {
        id: 'b2',
        name: 'Credit Card',
        color: '#f87171',
        hidden: false,
        placeholder: false,
        commodity: 'CURRENCY:USD:2',
        children: [],
      },
    ],
  },
  {
    id: 'c1',
    name: 'Income',
    color: null,
    hidden: false,
    placeholder: true,
    commodity: 'CURRENCY:USD:2',
    children: [
      {
        id: 'c2',
        name: 'Salary',
        color: null,
        hidden: false,
        placeholder: false,
        commodity: 'CURRENCY:USD:2',
        children: [],
      },
    ],
  },
  {
    id: 'd1',
    name: 'Expenses',
    color: null,
    hidden: false,
    placeholder: true,
    commodity: 'CURRENCY:USD:2',
    children: [
      {
        id: 'd2',
        name: 'Food & Dining',
        color: null,
        hidden: false,
        placeholder: false,
        commodity: 'CURRENCY:USD:2',
        children: [],
      },
      {
        id: 'd3',
        name: 'Housing',
        color: null,
        hidden: false,
        placeholder: false,
        commodity: 'CURRENCY:USD:2',
        children: [],
      },
    ],
  },
]
