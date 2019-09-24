import * as constants from './visit-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.CHANGE_COMPONENT]: (state, data) => {
    state.component = data || ""
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
  [constants.DELETE_SALE]: state => {
    state.visit.sale = {amount: 0, price: 0};
    state.visit.sales = [];
  },
  [constants.DELETE_PAYROLL]: state => {
    state.visit.payroll_sale = {amount: 0, price: 0};
    state.visit.payroll_sales = [];
    state.visit.payroll = {amount: 0, price: 0};
    state.visit.payrolls = [];
  }
}
