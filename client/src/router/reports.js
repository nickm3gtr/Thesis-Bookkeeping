import JournalReportPage from '@/views/Reports/JournalReportPage'
import LedgerReportPage from '@/views/Reports/LedgerReportPage'

export default [
  {
    path: '/bookkeeper/reports/journal',
    name: 'reports-journal',
    component: JournalReportPage,
    meta: {
      title: 'Journal'
    }
  },
  {
    path: '/bookkeeper/reports/ledger',
    name: 'reports-ledger',
    component: LedgerReportPage,
    meta: {
      title: 'Ledger'
    }
  }
]
