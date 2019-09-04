import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import state from './state'
import plugins from './plugins'

import employee from './modules/employee'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    employee
  },
  state,
  actions,
  mutations,
  strict: process.env.VUE_APP_DEBUG,
  plugins
})
