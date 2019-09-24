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
  [constants.CREATE_SALE]: async ({ commit }, {visit_id, data}) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post(`visits/${visit_id}/sales`, {products: data}).then(async response => {
        await commit(constants.EDIT, response.data);
        await commit(constants.LOADING);

        resolve(response.data);
      }).catch(error => {
        reject(error);
        commit(constants.LOADING);
      })
    })
  },
  [constants.EDIT_SALE]: async ({ commit }, {visit_id, data}) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.put(`visits/${visit_id}/sales`, {products: data}).then(async response => {
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
  [constants.DELETE_SALE]: async ({ commit }, id) => {
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

          await http.delete(`visits/${id}/sales`, {})
            .then(async response => {
              await commit(constants.DELETE_SALE);
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
  [constants.CREATE_PAYROLL]: async ({ commit }, data) => {
    return await new Promise(async (resolve, reject) => {
      await commit(constants.LOADING);

      await http.post('payrolls', data).then(async response => {
        await commit(constants.EDIT, response.data);
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

      await http.put(`payrolls/${data.id}`, data).then(async response => {
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
  [constants.DELETE_PAYROLL]: async ({ commit }, id) => {
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

          await http.delete(`visits/${id}/payrolls`, {})
            .then(async response => {
              await commit(constants.DELETE_PAYROLL);
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
}
