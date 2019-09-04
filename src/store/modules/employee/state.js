import {ls} from "@/services";

export default {
  loading: false,
  data: [],
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
    address: {},
    phone: {is_whatsapp: false, number: ''},
    created_at: ''
  }
}
