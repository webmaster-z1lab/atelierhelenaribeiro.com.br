import axios from 'axios';

export const ibge = {
  request: (url) => {
    return new Promise((resolve, reject) => {
      let instance = axios.create()

      delete instance.defaults.headers.common['X-CSRF-TOKEN'];

      instance.get(url).then(response => resolve(response)).catch(error => reject(error))
    })
  },

  async getCEP(parameter) {
    return await this.request(`https://viacep.com.br/ws/${parameter}/json/`)
  },

  async getStates() {
    return await this.request('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  },

  async getCities(parameter) {
    return await this.request(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${parameter}/municipios`)
  }
};
