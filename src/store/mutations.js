import * as types from './mutation-types'

export default {
  [types.CHANGE_LOADING](state, payload) {
    state.loading = payload
  },
  [types.AUTH_LOGIN](state, payload) {
    state.user = payload
  }
}

