<template>
  <loading :active.sync="loading" :is-full-page="isFullPage" :loader="loader" :color="color"></loading>
</template>

<style>
  .vld-overlay {
    z-index: 99 !important;
  }
</style>

<script>
  import NProgress from 'nprogress'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: "loading-vue",
    components: {
      Loading
    },
    props: {
      loading: {
        type: Boolean,
        default: true
      },
      color: {
        type: String,
        default: '#377dff'
      },
      loader: {
        type: String,
        default: 'spinner'
      },
      isFullPage: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      loading(value) {
        console.log(value)
        value ? NProgress.start() : NProgress.done()
      }
    }
  }
</script>
