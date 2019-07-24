import Vue from 'vue'
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App'

import store from './store/store'

import router from './routes/router'
import './registerServiceWorker'

import VeeValidate from 'vee-validate'
require('./form-validate/config/validator')

Vue.config.productionTip = false
Vue.config.devtools = process.env.VUE_APP_DEBUG
Vue.config.silent = process.env.VUE_APP_SILENT

// plugins setup
Vue.use(VeeValidate, { inject: false })
Vue.use(DashboardPlugin);

new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
