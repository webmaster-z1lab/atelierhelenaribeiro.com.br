import {Model} from '@vuex-orm/core'

export default class Product extends Model {
  static entity = 'products';

  static fields() {
    return {
      id: this.attr(null),
      size: this.attr(''),
      color: this.attr(''),
      template: this.attr(''),
      images: this.attr([]),
      price: this.attr(0),
      created_at: this.attr('')
    }
  }
}
