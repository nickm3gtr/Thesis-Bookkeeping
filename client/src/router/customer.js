import CustomerPage from '@/views/Customers/CustomerPage'
import ManagerCustomerPage from '@/views/Customers/ManagerCustomerPage'
import VendorPage from '@/views/Vendors/VendorPage'
import ManagerVendorPage from '@/views/Vendors/ManagerVendorPage'

export default [
  {
    path: '/bookkeeper/customers',
    name: 'customer-bookkeeper',
    component: ManagerCustomerPage,
    meta: {
      title: 'Customers'
    }
  },
  {
    path: '/admin/customers',
    name: 'customer-admin',
    component: CustomerPage,
    meta: {
      title: 'Customers'
    }
  },
  {
    path: '/manager/customers',
    name: 'customer-manager',
    component: CustomerPage,
    meta: {
      title: 'Customers'
    }
  },
  {
    path: '/bookkeeper/vendors',
    name: 'vendor-bookkeeper',
    component: ManagerVendorPage,
    meta: {
      title: 'Vendors'
    }
  },
  {
    path: '/admin/vendors',
    name: 'vendor-admin',
    component: VendorPage,
    meta: {
      title: 'Vendors'
    }
  },
  {
    path: '/manager/vendors',
    name: 'vendor-manager',
    component: VendorPage,
    meta: {
      title: 'Vendors'
    }
  }
]
