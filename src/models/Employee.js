import {Model} from '@vuex-orm/core'

export default class Employee extends Model {
  static entity = 'employees'

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
      email: this.string(''),
      document: this.string(''),
      type: this.string(''),
      address: this.attr({}),
      phone: this.attr(''),
      is_whatsapp: this.boolean(false),
      created_at: this.attr('')
    }
  }
}
