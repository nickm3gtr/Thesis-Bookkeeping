import GeneralJournalPage from '@/views/GeneralJournalPage'
import CashReceiptPage from '@/views/Books/CashReceiptPage'

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
  }
]
