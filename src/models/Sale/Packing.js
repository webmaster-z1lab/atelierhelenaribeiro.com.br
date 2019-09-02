import {Model} from '@vuex-orm/core';

export default class Packing extends Model {
  static entity = 'packings';

  static fields() {
    return {
      id: this.attr(null),
      seller: this.attr(''),
      products: this.attr([]),
      created_at: this.attr(''),
    }
  }
}
