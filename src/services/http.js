import axios from 'axios'
import httpBuildQuery from 'http-build-query'

import {ls} from '@/services'

export const http = {
  request: (method, url, data, headers = {}) => {
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        data: data,
        method: method.toLowerCase(),
        headers: headers
      }).then(response => resolve(response)).catch(error => reject(error))
    })
  },

  async get(url, params, headers) {
    if (params !== null) url = url + '?' + httpBuildQuery(params)

    return await this.request('get', url, {}, headers)
  },

  async post(url, data, headers) {
    return await this.request('post', url, data, headers)
  },

  async put(url, data, headers) {
    return await this.request('put', url, data, headers)
  },

  async delete(url, data = {}, headers) {
    return await this.request('delete', url, data, headers)
  },

  init: () => {
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${ls.get('api_token')}`
      config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
      config.headers.common['Accept'] = 'application/json'

      return config
    })
  }
}
