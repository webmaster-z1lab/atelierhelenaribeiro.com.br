import * as types from './mutation-types'

export default {
    changeLoading(context, payload) {
        context.commit(types.CHANGE_LOADING, payload)
    },
    initEvent(context, payload) {
        context.dispatch('changeLoading', false)
        context.commit(types.INIT_EVENT, JSON.parse(payload))
    },
    changeEvent(context, payload) {
        context.dispatch('changeLoading', false)
        context.commit(types.CHANGE_EVENT, payload)
    }
}
