import * as constants from './employee-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, employees) => {
    state.employees = employees
  },
  [constants.SET]: (state, employee) => {
    state.employee = employee
  },
  [constants.CREATE]: (state, employee) => {
    state.employees.push(employee)
  },
  [constants.EDIT]: (state, employee) => {
    state.employee = employee
  },
  [constants.DELETE]: (state, employee) => {
    state.employees.splice(state.employees.indexOf(employee), 1)
  }
}
