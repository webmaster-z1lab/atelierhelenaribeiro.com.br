import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import state from './state'

import employee from './modules/employee'
import customer from './modules/customer'
import template from './modules/template'
import product from './modules/product'
import packing from './modules/packing'

import createLogger from "vuex/dist/logger";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    employee,
    customer,
    template,
    product,
    packing
  },
  state,
  actions,
  mutations,
  strict: process.env.VUE_APP_DEBUG,
  plugins: process.env.VUE_APP_ENV !== 'production' ? [createLogger()] : []
})
