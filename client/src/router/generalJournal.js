import GeneralJournalPage from '@/views/GeneralJournalPage'
import CashReceiptPage from '@/views/Books/CashReceiptPage'
import CashDisbursementPage from '@/views/Books/CashDisbursementPage'
import SalesBookPage from '@/views/Books/SalesBookPage'
import PurchaseBookPage from '@/views/Books/PurchaseBookPage'
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
    path: '/bookkeeper/cash-disbursement',
    name: 'cash-disbursement-bookkeeper',
    component: CashDisbursementPage,
    meta: {
      title: 'Cash Disbursement Books'
    }
  },
  {
    path: '/bookkeeper/sales-book',
    name: 'sales-book-bookkeeper',
    component: SalesBookPage,
    meta: {
      title: 'Sales Book'
    }
  },
  {
    path: '/bookkeeper/purchase-book',
    name: 'purchase-book-bookkeeper',
    component: PurchaseBookPage,
    meta: {
      title: 'Purchase Book'
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
