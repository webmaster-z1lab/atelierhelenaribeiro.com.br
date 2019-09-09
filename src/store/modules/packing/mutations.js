import * as constants from './packing-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, packings) => {
    state.packings = packings
  },
  [constants.SET]: (state, packing) => {
    state.packing = packing
  },
  [constants.CREATE]: (state, packing) => {
    state.packings.push(packing)
  },
  [constants.EDIT]: (state, packing) => {
    state.packing = packing
  },
  [constants.DELETE]: (state, packing) => {
    state.packings.splice(state.packings.indexOf(packing), 1)
  }
}
