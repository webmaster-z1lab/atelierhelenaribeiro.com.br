import * as constants from './visit-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, visits) => {
    state.visits = visits
  },
  [constants.SET]: (state, visit) => {
    state.visit = visit
  },
  [constants.CREATE]: (state, visit) => {
    state.visits.push(visit)
  },
  [constants.EDIT]: (state, visit) => {
    state.visit = visit
  },
  [constants.DELETE]: (state, visit) => {
    state.visits.splice(state.visits.indexOf(visit), 1)
  },
  [constants.SET_SALE]: (state, sale) => {
    state.sale = sale
  },
  [constants.CREATE_SALE]: (state, sale) => {
    state.sale = sale
  },
  [constants.SET_PAYROLL]: (state, payroll) => {
    state.payroll = payroll
  },
  [constants.CREATE_PAYROLL]: (state, payroll) => {
    state.payroll = payroll
  },
}
