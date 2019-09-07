import DashboardBookkeeper from '@/views/DashboardBookkeeper'
import DashboardAdmin from '@/views/DashboardAdmin'

export default [
  {
    path: '/bookkeeper/dashboard',
    name: 'dashboard-bookkeeper',
    component: DashboardBookkeeper,
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard-admin',
    component: DashboardAdmin,
    meta: {
      title: 'Dashboard'
    }
  }
]
