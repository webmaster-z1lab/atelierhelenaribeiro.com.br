import {Model} from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'users'

  static fields() {
    return {
      id: this.string(''),
      name: this.string(''),
      type: this.string(''),
      email: this.string(''),
      avatar: this.string('')
    }
  }
}
