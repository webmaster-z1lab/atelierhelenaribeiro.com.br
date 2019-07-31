import {Model} from '@vuex-orm/core'

export default class Employee extends Model {
  static entity = 'employees'

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(''),
      document: this.string(''),
      type: this.string(''),
      address: this.attr({}),
      //   {
      //   postal_code: this.string(''),
      //   state: this.string(''),
      //   district: this.string(''),
      //   city: this.string(''),
      //   street: this.string(''),
      //   number: this.attr(null),
      //   complement: this.string('').nullable()
      // },
      phone: this.string(''),
      is_whatsapp: this.boolean(false)
    }
  }
}
