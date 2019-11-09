import CustomerPage from '@/views/Customers/CustomerPage'
import VendorPage from '@/views/Vendors/VendorPage'

export default [
  {
    path: '/bookkeeper/customers',
    name: 'customer-bookkeeper',
    component: CustomerPage,
    meta: {
      title: 'Customers'
    }
  },
  {
    path: '/bookkeeper/vendors',
    name: 'vendor-bookkeeper',
    component: VendorPage,
    meta: {
      title: 'Vendors'
    }
  }
]
