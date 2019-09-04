import createLogger from 'vuex/dist/logger'

const localStoragePlugin = store => {
  store.subscribe((mutation, { data }) => {
    window.localStorage.setItem('test-vuejs', JSON.stringify(data))
  })
}

export default process.env.VUE_APP_ENV !== 'production'
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin]
