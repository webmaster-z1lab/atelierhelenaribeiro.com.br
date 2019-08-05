import Loading from '@/components/App/Loading'

export default {
  $_veeValidate: {
    validator: 'new'
  },
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      validated: false,
    }
  },
  methods: {
    changeLoading() {
      this.loading = !this.loading
    },
    getError(name) {
      return this.errors.first(name)
    },
    isValid(name) {
      return this.validated && !this.errors.has(name);
    },
  }
}
