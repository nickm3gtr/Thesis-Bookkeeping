import CustomerPage from '@/views/Customers/CustomerPage'

export default [
  {
    path: '/bookkeeper/customers',
    name: 'customer-bookkeeper',
    component: CustomerPage,
    meta: {
      title: 'Customers'
    }
  }
]
