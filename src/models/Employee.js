import {Model} from '@vuex-orm/core'

export default class Employee extends Model {
  static entity = 'employees';

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
      email: this.string(''),
      document: this.string(''),
      birth_date: this.string(''),
      admission_date: this.string(''),
      identity: this.string(''),
      work_card: this.string(''),
      remuneration: this.attr(0),
      type: this.string(''),
      address: this.attr({}),
      phone: this.attr({is_whatsapp: false, number: ''}),
      created_at: this.attr('')
    }
  }
}
