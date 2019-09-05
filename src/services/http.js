import axios from 'axios';
import httpBuildQuery from 'http-build-query';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import {ls} from '@/services';

export const http = {
  request: (method, url, data, headers = {}, external) => {
    return new Promise((resolve, reject) => {
      if (external) delete instance.defaults.headers.common['Authorization'];

      axios({
        url: external ? url : process.env.VUE_APP_API_URL + url,
        data: data,
        method: method.toLowerCase(),
        headers: headers
      }).then(response => resolve(response)).catch(error => reject(error));
    });
  },

  async get(url, params, headers, external = false) {
    if (params) url = url + '?' + httpBuildQuery(params);

    return await this.request('get', url, {}, headers, external);
  },

  async post(url, data, headers, external = false) {
    return await this.request('post', url, data, headers, external);
  },

  async put(url, data, headers, external = false) {
    return await this.request('put', url, data, headers, external);
  },

  async delete(url, data = {}, headers, external = false) {
    return await this.request('delete', url, data, headers, external);
  },

  init: () => {
    axios.interceptors.request.use(config => {
      NProgress.start();

      if (ls.get('api-token')) config.headers.Authorization = `Bearer ${ls.get('api-token')}`;

      config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
      config.headers.common['Accept'] = 'application/json';

      return config;
    });

    axios.interceptors.response.use(response => {
      NProgress.done();

      return response;
    });
  }
};
