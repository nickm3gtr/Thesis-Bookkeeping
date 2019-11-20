import CustomerPage from '@/views/Customers/CustomerPage'
import ManagerCustomerPage from '@/views/Customers/ManagerCustomerPage'
import VendorPage from '@/views/Vendors/VendorPage'
import ManagerVendorPage from '@/views/Vendors/ManagerVendorPage'
import CustomerProfile from '@/views/Customers/CustomerProfile'
import VendorProfile from '@/views/Vendors/VendorProfile'

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
  },
  // Customer Profile
  {
    path: '/bookkeeper/customer/:id',
    name: 'customer-profile-bookkeeper',
    component: CustomerProfile,
    meta: {
      title: 'Customer Profile'
    }
  },
  {
    path: '/manager/customer/:id',
    name: 'customer-profile-manager',
    component: CustomerProfile,
    meta: {
      title: 'Customer Profile'
    }
  },
  {
    path: '/admin/customer/:id',
    name: 'customer-profile-admin',
    component: CustomerProfile,
    meta: {
      title: 'Customer Profile'
    }
  },
  // Vendor Profile
  {
    path: '/bookkeeper/vendor/:id',
    name: 'vendor-profile-bookkeeper',
    component: VendorProfile,
    meta: {
      title: 'Vendor Profile'
    }
  },
  {
    path: '/manager/vendor/:id',
    name: 'vendor-profile-manager',
    component: VendorProfile,
    meta: {
      title: 'Vendor Profile'
    }
  },
  {
    path: '/admin/vendor/:id',
    name: 'vendor-profile-admin',
    component: VendorProfile,
    meta: {
      title: 'Vendor Profile'
    }
  }
]
