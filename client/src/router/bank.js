import BankPage from '@/views/Banks/BankPage'
import AdminBankPage from '@/views/Banks/AdminBankPage'

export default [
  {
    path: '/bookkeeper/banks',
    name: 'bank-bookkeeper',
    component: BankPage,
    meta: {
      title: 'Banks'
    }
  },
  {
    path: '/manager/banks',
    name: 'bank-manager',
    component: BankPage,
    meta: {
      title: 'Banks'
    }
  },
  {
    path: '/admin/banks',
    name: 'bank-admin',
    component: AdminBankPage,
    meta: {
      title: 'Banks'
    }
  }
]
