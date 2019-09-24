import GeneralJournalPage from '@/views/GeneralJournalPage'
import CashReceiptPage from '@/views/Books/CashReceiptPage'
import TransactionListPage from '@/views/Books/TransactionListPage'
import TransactionFilterPage from '@/views/Books/TransactionFilterPage'

export default [
  {
    path: '/bookkeeper/general-journal',
    name: 'general-journal-bookkeeper',
    component: GeneralJournalPage,
    meta: {
      title: 'General Journal'
    }
  },
  {
    path: '/bookkeeper/cash-receipt',
    name: 'cash-receipt-bookkeeper',
    component: CashReceiptPage,
    meta: {
      title: 'Cash Receipt Books'
    }
  },
  {
    path: '/bookkeeper/transactions',
    name: 'transactions-bookkeeper',
    component: TransactionListPage,
    meta: {
      title: 'Transactions'
    }
  },
  {
    path: '/bookkeeper/transactions/:transId',
    name: 'transactions-filter',
    component: TransactionFilterPage,
    meta: {
      title: 'Transactions'
    }
  }
]
