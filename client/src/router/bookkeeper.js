import BookkeepersAdmin from '@/views/BookkeepersAdmin'
import ManagersAdmin from '@/views/ManagersAdmin'
import BookkeeperProfile from '@/views/BookkeeperProfile'

export default [
  {
    path: '/admin/bookkeepers',
    name: 'admin-bookkeepers',
    component: BookkeepersAdmin,
    meta: {
      title: 'Bookkeepers'
    }
  },
  {
    path: '/admin/managers',
    name: 'admin-managers',
    component: ManagersAdmin,
    meta: {
      title: 'Managers'
    }
  },
  {
    path: '/bookkeeper/profile',
    name: 'bookkeeper-profile',
    component: BookkeeperProfile,
    meta: {
      title: 'Bookkeeper Profile'
    }
  }
]
