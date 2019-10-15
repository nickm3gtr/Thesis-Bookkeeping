import BookkeepersAdmin from '@/views/BookkeepersAdmin'
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
    path: '/bookkeeper/profile',
    name: 'bookkeeper-profile',
    component: BookkeeperProfile,
    meta: {
      title: 'Bookkeeper Profile'
    }
  }
]
