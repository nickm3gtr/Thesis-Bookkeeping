import ChartofAccountBookkeeper from '@/views/ChartofAccountBookkeeper'
import ChartofAccountAdmin from '@/views/ChartofAccountAdmin'

export default [
  {
    path: '/bookkeeper/chart_of_account',
    name: 'chart-bookkeeper',
    component: ChartofAccountBookkeeper,
    meta: {
      title: 'Chart of Accounts'
    }
  },
  {
    path: '/admin/chart_of_account',
    name: 'chart-admin',
    component: ChartofAccountAdmin,
    meta: {
      title: 'Chart of Accounts'
    }
  }
]
