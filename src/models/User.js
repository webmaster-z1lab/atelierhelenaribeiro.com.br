import { Model } from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'users'

  static fields () {
    return {
      id: this.increment(),
      name: this.string(''),
      type: this.string(''),
      email: this.string(''),
      avatar: this.string('')
    }
  }
}
