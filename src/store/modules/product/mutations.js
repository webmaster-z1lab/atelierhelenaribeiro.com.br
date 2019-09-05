import * as constants from './product-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, products) => {
    state.products = products
  },
  [constants.SET]: (state, product) => {
    state.product = product
  },
  [constants.CREATE]: (state, product) => {
    state.products.push(product)
  },
  [constants.EDIT]: (state, product) => {
    state.product = product
  },
  [constants.DELETE]: (state, product) => {
    state.products.splice(state.products.indexOf(product), 1)
  },
  [constants.DELETE_IMAGE]: (state, key) => {
    state.product.images.splice(key, 1)
  }
}
