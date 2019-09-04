import * as constants from './root-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.SET_USER]: (state, data) => {
    state.user = data
  }
}
