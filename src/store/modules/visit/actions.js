import * as constants from './visit-const'
import {http} from "@/services";
import swal from 'sweetalert2';

export default {
  [constants.GET_ALL]: async ({ commit }) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.get('visits').then(async response => {
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

      await http.get(`visits/${id}`).then(async response => {
          await commit(constants.SET, response.data);
        if (response.data.sale) await commit(constants.SET_SALE, response.data.sale);
        if (response.data.payroll) await commit(constants.SET_PAYROLL, response.data.payroll);
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

      await http.post('visits', data).then(async response => {
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

      await http.put(`visits/${data.id}`, data).then(async response => {
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

          await http.delete(`visits/${data.id}`, {})
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
  [constants.CREATE_SALE]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post('sales', data).then(async response => {
        await commit(constants.CREATE_SALE, response.data);
        await commit(constants.LOADING);

        resolve(response.data);
      }).catch(error => {
        reject(error);
        commit(constants.LOADING);
      })
    })
  },
  [constants.EDIT_SALE]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.put(`sales/${data.id}`, data).then(async response => {
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
  [constants.CREATE_PAYROLL]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post('payrolls', data).then(async response => {
        await commit(constants.CREATE_PAYROLL, response.data);
        await commit(constants.LOADING);

        resolve(response.data);
      }).catch(error => {
        reject(error);
        commit(constants.LOADING);
      })
    })
  },
  [constants.EDIT_PAYROLL]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.put(`sales/${data.id}`, data).then(async response => {
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
}
