<template>
  <router-view v-if="initView"/>
  <loading v-else/>
</template>

<script>
  import Loading from './components/App/Loading'

  import User from './models/User'
  import {ls} from "@/services";

  export default {
    data: () => ({
      initView: false
    }),
    components: {
      Loading
    },
    methods: {
      async init() {
        await User.$get({params: {id: ls.get('user_id')}});
      }
    },
    async created() {
      const token = ls.get('api_token');

      if (token) await this.init();

      this.initView = true
    }
  }
</script>
