import {isObject} from "lodash";

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
  let msg = 'Erro desconhecido, atualize a página e tente novamente se persistir entre em contato com a gente!'

  if (isObject(error.response)) {
    msg = error.response.data.errors ? error.response.data.errors.detail : error.response.data.message || msg;

    notify({
      message: msg,
      timeout: 5000,
      icon: 'ni ni-fat-remove',
      type: 'danger'
    });
  } else {
    console.dir(error)

    notify({
      message: msg,
      timeout: 5000,
      icon: 'ni ni-fat-remove',
      type: 'danger'
    });
  }
}
