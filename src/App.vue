<template>
  <router-view/>
</template>

<script>
  import User from './models/User'
  import {ls} from "@/services";

  export default {
    methods: {
      async init() {
        await User.$get({params: {id: ls.get('user_id')}})
      }
    },
    created() {
      const token = ls.get('api_token')

      if (token) this.init()
    }
  }
</script>
