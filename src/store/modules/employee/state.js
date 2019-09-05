export default {
  loading: false,
  employees: [],
  employee: {
    id: null,
    email: '',
    name: '',
    document: '',
    birth_date: '',
    admission_date: '',
    identity: '',
    work_card: '',
    remuneration: 0,
    type: '',
    address: {
      postal_code: '',
      state: '',
      district: '',
      city: '',
      street: '',
      number: '',
      complement: ''
    },
    phone: {is_whatsapp: false, number: ''},
    created_at: ''
  }
}
