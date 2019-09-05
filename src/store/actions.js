import * as constants from './root-const'
import {http, ls} from "@/services";

export default {
  [constants.LOGIN]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      let time_storage = null;

      if (!data.remember) {
        time_storage = process.env.VUE_APP_SESSION_LIFETIME;
        delete data.remember
      }

      await commit(constants.LOADING);

      await http.post('login', data)
        .then(async response => {
          await commit(constants.SET_USER, response.data);

          await ls.set('user', response.data, time_storage);
          await ls.set('api-token', response.data.api_token, time_storage);
          await commit(constants.LOADING);

          resolve(response.data);
        }).catch(error => {
          reject(error);
          commit(constants.LOADING);
        })
    })
  },
  [constants.LOGOUT]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post('logout', {})
        .then(async response => {
          await ls.clear();
          await commit(constants.SET_USER, {});
          await commit(constants.LOADING);

          resolve(response);
        })
        .catch(error => {
          reject(error);
          commit(constants.LOADING);
        })
    })
  }
}
