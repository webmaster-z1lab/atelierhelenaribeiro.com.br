import * as types from './mutation-types'

export default {
    [types.CHANGE_LOADING] (state, payload) {
        state.isLoading = payload
    },
    [types.INIT_EVENT] (state, payload) {
        state.event = payload
    },
    [types.CHANGE_EVENT] (state, payload) {
        state.event = payload
    }
}

