import JournalReportPage from '@/views/Reports/JournalReportPage'
import LedgerReportPage from '@/views/Reports/LedgerReportPage'
import TrialBalanceReportPage from '@/views/Reports/TrialBalanceReportPage'

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
  },
  {
    path: '/bookkeeper/reports/trial-balance',
    name: 'reports-trialBalance',
    component: TrialBalanceReportPage,
    meta: {
      title: 'Trial Balance'
    }
  }
]
