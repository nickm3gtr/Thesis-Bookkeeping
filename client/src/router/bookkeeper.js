import BookkeepersAdmin from '@/views/BookkeepersAdmin'

export default [
  {
    path: '/admin/bookkeepers',
    name: 'admin-bookkeepers',
    component: BookkeepersAdmin,
    meta: {
      title: 'Bookkeepers'
    }
  }
]
