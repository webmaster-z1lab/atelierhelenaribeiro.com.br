import {Model} from '@vuex-orm/core'

export default class Template extends Model {
  static entity = 'templates';

  static fields() {
    return {
      id: this.attr(null),
      price: this.attr(0),
      reference: this.attr(''),
      is_active: this.boolean(true),
      images: this.attr([]),
      created_at: this.attr('')
    }
  }
}
