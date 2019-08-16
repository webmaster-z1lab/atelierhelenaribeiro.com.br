import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import database from '@/config/database'

import {ls} from "@/services";

Vue.use(Vuex);

VuexORM.use(VuexORMAxios, {
  database,
  http: {
    baseURL: process.env.VUE_APP_API_URL,
    url: '/',
    access_token: ls.get('api_token'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

const store = new Vuex.Store({
  namespaced: true,
  plugins: [VuexORM.install(database)]
});

export default store
