import * as types from '../../store/mutation-types'

export default {
    [types.SET_TICKETS] (state, payload) {
        state.ticket = payload
    },
    [types.SET_COUPON] (state, payload) {
        state.coupon = payload
    },
    [types.SET_COUPONS] (state, payload) {
        state.coupons = payload
    }
}
