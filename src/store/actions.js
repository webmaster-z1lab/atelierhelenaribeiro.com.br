import * as types from './mutation-types'

export default {
  changeLoading(context, payload) {
    context.commit(types.CHANGE_LOADING, payload)
  },
  authLogin(context, payload) {
    context.commit(types.AUTH_LOGIN, payload)
  }
}
