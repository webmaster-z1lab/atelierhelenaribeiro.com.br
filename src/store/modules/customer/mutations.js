import * as constants from './customer-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, customers) => {
    state.customers = customers
  },
  [constants.SET]: (state, customer) => {
    state.customer = customer
  },
  [constants.CREATE]: (state, customer) => {
    state.customers.push(customer)
  },
  [constants.EDIT]: (state, customer) => {
    state.customer = customer
  },
  [constants.DELETE]: (state, customer) => {
    state.customers.splice(state.customers.indexOf(customer), 1)
  }
}
