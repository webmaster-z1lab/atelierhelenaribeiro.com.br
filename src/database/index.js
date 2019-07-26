import { Database } from '@vuex-orm/core'
import User from '@/models/User'

const database = new Database()

const configDefault = {
  state: {
    loading: false
  },
  actions: {
    changeLoading(context, payload) {
      context.commit("CHANGE_LOADING", payload)
    }
  },
  mutations: {
    CHANGE_LOADING(state, payload) {
      state.loading = payload
    }
  }
}

database.register(User, configDefault)

export default database

