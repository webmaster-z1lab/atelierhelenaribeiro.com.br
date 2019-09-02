import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App';

import {http} from "./services";

import store from './store/store';
import router from './routes/router';
import './registerServiceWorker';
import VueCurrencyFilter from 'vue-currency-filter'

/* Money */
Vue.use(VueCurrencyFilter,
  {
    symbol : 'R$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })

// Vue.config.productionTip = false;
// Vue.config.devtools = process.env.VUE_APP_DEBUG;
// Vue.config.silent = process.env.VUE_APP_SILENT;

// plugins setup
Vue.use(DashboardPlugin);

new Vue({
  el: '#app',
  render: h => h(App),
  created: () => http.init(),
  store,
  router
})
