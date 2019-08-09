import { Database } from '@vuex-orm/core'

const database = new Database(),
  requireModel = require.context('@/models', true, /\.js$/);

requireModel.keys().forEach(fileName => {
  database.register(requireModel(fileName).default)
})

export default database

