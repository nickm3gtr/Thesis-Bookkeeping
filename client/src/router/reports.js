import JournalReportPage from '@/views/Reports/JournalReportPage'
import LedgerReportPage from '@/views/Reports/LedgerReportPage'
import TrialBalanceReportPage from '@/views/Reports/TrialBalanceReportPage'
import IncomeStatementPage from '@/views/Reports/IncomeStatementPage'
import BalanceSheetPage from '@/views/Reports/BalanceSheetPage'
import AdminJournalPage from '@/views/AdminReports/AdminJournalPage'

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
  },
  {
    path: '/bookkeeper/reports/income-statement',
    name: 'reports-incomeStatement',
    component: IncomeStatementPage,
    meta: {
      title: 'Income Statement'
    }
  },
  {
    path: '/bookkeeper/reports/balance-sheet',
    name: 'reports-balanceSheet',
    component: BalanceSheetPage,
    meta: {
      title: 'Balance Sheet'
    }
  },
  {
    path: '/admin/reports/journal',
    name: 'reports-journal-admin',
    component: AdminJournalPage,
    meta: {
      title: 'Journal'
    }
  }
]
