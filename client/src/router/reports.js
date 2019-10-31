import JournalReportPage from '@/views/Reports/JournalReportPage'
import LedgerReportPage from '@/views/Reports/LedgerReportPage'
import TrialBalanceReportPage from '@/views/Reports/TrialBalanceReportPage'
import IncomeStatementPage from '@/views/Reports/IncomeStatementPage'
import BalanceSheetPage from '@/views/Reports/BalanceSheetPage'
import AdminJournalPage from '@/views/AdminReports/AdminJournalPage'
import AdminLedgerPage from '@/views/AdminReports/AdminLedgerPage'
import AdminTrialBalancePage from '@/views/AdminReports/AdminTrialBalancePage'
import AdminBalanceSheetPage from '@/views/AdminReports/AdminBalanceSheetPage'
import AdminIncomeStatementPage from '@/views/AdminReports/AdminIncomeStatementPage'
import AdminNotesPage from '@/views/AdminReports/AdminNotesPage'
import NotesPage from '@/views/Reports/NotesPage'
import DistributePage from '@/views/Reports/DistributePage'

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
    path: '/bookkeeper/reports/summary',
    name: 'reports-notes-bookkeeper',
    component: NotesPage,
    meta: {
      title: 'Year-End Report'
    }
  },
  {
    path: '/bookkeeper/reports/distribute',
    name: 'reports-distribute-bookkeeper',
    component: DistributePage,
    meta: {
      title: 'Year-End Report'
    }
  },
  {
    path: '/admin/reports/journal',
    name: 'reports-journal-admin',
    component: AdminJournalPage,
    meta: {
      title: 'Journal'
    }
  },
  {
    path: '/admin/reports/ledger',
    name: 'reports-ledger-admin',
    component: AdminLedgerPage,
    meta: {
      title: 'Ledger'
    }
  },
  {
    path: '/admin/reports/trial-balance',
    name: 'reports-trialBalance-admin',
    component: AdminTrialBalancePage,
    meta: {
      title: 'Trial Balance'
    }
  },
  {
    path: '/admin/reports/balance-sheet',
    name: 'reports-balanceSheet-admin',
    component: AdminBalanceSheetPage,
    meta: {
      title: 'Balance Sheet'
    }
  },
  {
    path: '/admin/reports/income-statement',
    name: 'reports-incomeStatement-admin',
    component: AdminIncomeStatementPage,
    meta: {
      title: 'Income Statement'
    }
  },
  {
    path: '/admin/reports/summary',
    name: 'reports-notes-admin',
    component: AdminNotesPage,
    meta: {
      title: 'Summary Report'
    }
  }
]
