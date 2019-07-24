import {HTTP} from "./bootstrap"
import httpBuildQuery from 'http-build-query'
import {isObject} from "lodash";

/**
 * For API search, return a promise
 *
 * @param url
 * @param params
 * @param headers
 * @returns {Promise<any>}
 */
export async function toSeek(url, params = null, headers = {}) {

  if (params !== null) url = url + '?' + httpBuildQuery(params)

  return await new Promise((resolve, reject) => {
    HTTP.get(url, {headers: headers}).then(response => resolve(response.data)).catch(e => reject(e))
  })
}

/**
 * Send to api requests via Axios, return a promise
 *
 * @param url
 * @param data
 * @param method
 * @param headers
 * @returns {Promise<any>}
 */
export async function sendAPI(url, data, method = 'POST', headers = {}) {
  return await new Promise((resolve, reject) => {
    HTTP({
      method: method,
      url: url,
      data: data,
      headers: headers
    }).then(
      response => {
        resolve(response)
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
}

/**
 * Visual notification
 *
 * @param notify
 * @param msg
 * @param type
 * @param icon
 * @param time
 */
export function notifyVue(notify, msg, type = 'default', icon = 'ni ni-bell-55', time = 5000) {
  notify({
    message: msg,
    timeout: time,
    icon: icon,
    type
  });
}

/**
 * Visual notification error
 *
 * @param notify
 * @param error
 */
export function notifyError(notify, error) {
  if (isObject(error.response)) {
    let msg = error.response.data.errors ? error.response.data.errors.detail : error.response.data.message

    notify({
      message: msg,
      timeout: 5000,
      icon: 'ni ni-fat-remove',
      type: 'danger'
    });

  } else {
    console.dir(error)

    notify({
      message: 'Atualize a página e tente novamente se persistir entre em contato com a gente!',
      timeout: 5000,
      icon: 'ni ni-fat-remove',
      type: 'danger'
    });
  }
}
