import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import actions from './actions'

import checkIn from '../modules/check-in/main'
import financial from '../modules/financial/main'
import participant from '../modules/participant/main'
import tickets from '../modules/tickets/main'
import panel from '../modules/panel/main'

Vue.use(Vuex);

export default new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {
        checkIn,
        financial,
        participant,
        tickets,
        panel
    },
})
