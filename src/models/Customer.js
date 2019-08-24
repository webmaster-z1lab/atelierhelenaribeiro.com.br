import {Model} from '@vuex-orm/core'

export default class Customer extends Model {
  static entity = 'customers';

  static fields() {
    return {
      id: this.attr(null),
      company_name: this.string(''),
      trading_name: this.string(''),
      document: this.string(''),
      state_registration: this.string(''),
      municipal_registration: this.string(''),
      email: this.string(''),
      contact: this.string(''),
      status: this.string('active'),
      annotation: this.string(''),
      phones: this.attr([]),
      owners: this.attr([]),
      address: this.attr({}),
      seller: this.attr(''),
      created_at: this.attr('')
    }
  }
}
