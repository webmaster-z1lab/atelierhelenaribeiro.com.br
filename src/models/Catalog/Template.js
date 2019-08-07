import {Model} from '@vuex-orm/core'

export default class Template extends Model {
  static entity = 'templates';

  static fields() {
    return {
      id: this.attr(null),
      price_base: this.attr(0),
      reference: this.attr(''),
      status: this.attr(''),
      created_at: this.attr('')
    }
  }
}
