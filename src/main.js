import Vue from 'vue'
import DashboardPlugin from '@/plugins/dashboard-plugin';
import App from './App'

import router from './routes/router'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.config.devtools = process.env.APP_DEBUG
Vue.config.silent = process.env.APP_SILENT

Vue.use(DashboardPlugin);

new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
