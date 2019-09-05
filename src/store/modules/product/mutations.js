import * as constants from './template-const'

export default {
  [constants.LOADING]: state => {
    state.loading = !state.loading
  },
  [constants.LIST]: (state, templates) => {
    state.templates = templates
  },
  [constants.SET]: (state, template) => {
    state.template = template
  },
  [constants.CREATE]: (state, template) => {
    state.templates.push(template)
  },
  [constants.EDIT]: (state, template) => {
    state.template = template
  },
  [constants.DELETE]: (state, template) => {
    state.templates.splice(state.templates.indexOf(template), 1)
  },
  [constants.DELETE_IMAGE]: (state, key) => {
    state.template.images.splice(key, 1)
  }
}
