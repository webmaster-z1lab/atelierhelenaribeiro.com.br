import {Model} from '@vuex-orm/core';
import Template from "@/models/Catalog/Template";

export default class Product extends Model {
  static entity = 'products';

  static fields() {
    return {
      id: this.attr(null),
      size: this.attr(''),
      color: this.attr(''),
      template_id: this.attr(''),
      template: this.belongsTo(Template, 'template_id'),
      images: this.attr([]),
      price: this.attr(0),
      created_at: this.attr('')
    }
  }
}
