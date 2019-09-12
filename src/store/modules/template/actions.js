import * as constants from './template-const'
import {http} from "@/services";
import swal from 'sweetalert2';

export default {
  [constants.GET_ALL]: async ({ commit }) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.get('templates').then(async response => {
        await commit(constants.LIST, response.data);
        await commit(constants.LOADING);
        resolve(response.data);
      }).catch(error => {
        reject(error);
        commit(constants.LOADING);
      })
    })
  },
  [constants.GET]: async ({ commit }, id) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.get(`templates/${id}`).then(async response => {
          await commit(constants.SET, response.data);
          await commit(constants.LOADING);
          resolve(response.data);
        }).catch(error => {
          reject(error);
          commit(constants.LOADING);
        })
    })
  },
  [constants.CREATE]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post('templates', data).then(async response => {
          await commit(constants.CREATE, response.data);
          await commit(constants.LOADING);

          resolve(response.data);
        }).catch(error => {
          reject(error);
          commit(constants.LOADING);
        })
    })
  },
  [constants.EDIT]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.put(`templates/${data.id}`, data).then(async response => {
          await commit(constants.EDIT, response.data);
          await commit(constants.LOADING);

          resolve(response.data);
        })
        .catch(error => {
          reject(error);
          commit(constants.LOADING);
        })
    })
  },
  [constants.DELETE]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      swal({
        title: 'Você tem Certeza?',
        text: `Ao fazer isso os dados não poderão ser recuperados!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false
      }).then(async response => {
        if (response.value) {
          await commit(constants.LOADING);

          await http.delete(`templates/${data.id}`, {})
            .then(async response => {
              await commit(constants.DELETE, data);
              await commit(constants.LOADING);

              resolve(response.data);
            }).catch(error => {
              reject(error);
              commit(constants.LOADING);
            });
        }
      });
    })
  },
  [constants.DELETE_IMAGE]: async ({state, commit }, {id, key}) => {
    return await new Promise(async (resolve, reject) => {
      swal({
        title: 'Você tem Certeza?',
        text: `Ao fazer isso os dados não poderão ser recuperados!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Sim, apagar!',
        cancelButtonText: 'Cancelar',
        buttonsStyling: false
      }).then(async response => {
        if (response.value) {
          await commit(constants.LOADING);

          await http.delete(`/images/${id}/templates/${state.template.id}`, {})
            .then(async response => {
              await commit(constants.DELETE_IMAGE, key);
              await commit(constants.LOADING);

              resolve(response.data);
            }).catch(error => {
              reject(error);
              commit(constants.LOADING);
            });
        }
      });
    })
  }
}
