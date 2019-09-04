import * as types from './root-const'
import {http, ls} from "@/services";

export default {
  [types.LOGIN]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      let time_storage = null;

      if (!data.remember) {
        time_storage = process.env.VUE_APP_SESSION_LIFETIME;
        delete data.remember
      }

      await commit(types.LOADING);

      await http.post(`${process.env.VUE_APP_API_URL}/login`, data)
        .then(async response => {
          await commit(types.SET_USER, response.data);

          await ls.set('user', response.data, time_storage);
          await commit(types.LOADING);

          resolve(response.data);
        }).catch(error => {
          reject(error);
          commit(types.LOADING);
        })
    })
  },
  [types.LOGOUT]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(types.LOADING);

      await http.post(`${process.env.VUE_APP_API_URL}/logout`, {})
        .then(async response => {
          await ls.clear();
          await commit(types.SET_USER, {});
          await commit(types.LOADING);

          resolve(response);
        })
        .catch(error => {
          reject(error);
          commit(types.LOADING);
        })
    })
  }
}
