<template>
  <div>
    <notifications/>
    <base-nav v-model="showMenu" type="light" :transparent="true" menu-classes="justify-content-end" class="navbar-horizontal navbar-main" expand="lg">
      <div slot="brand" class="navbar-wrapper">
        <router-link class="navbar-brand" to="/">
          <img src="/img/brand/chr-icon.png"> H. Ribeiro
        </router-link>
      </div>

      <template>
        <div class="navbar-collapse-header">
          <div class="row">
            <div class="col-6 collapse-brand">
              <router-link to="/">
                <img src="/img/brand/chr-icon.png"> H. Ribeiro
              </router-link>
            </div>
            <div class="col-6 collapse-close">
              <button type="button" class="navbar-toggler" @click="showMenu = false">
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </base-nav>

    <div class="main-content">
      <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
        <router-view/>
      </zoom-center-transition>
    </div>

    <footer class="py-5" id="footer-main">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              © {{year}} Confecção Helena Ribeiro
            </div>
          </div>
          <div class="col-xl-6">
            <ul class="nav nav-footer justify-content-center justify-content-xl-end">
              <li class="nav-item">
                <a href="https://z1lab.com.br" class="nav-link" target="_blank">
                  <img src="https://d35c048n9fix3e.cloudfront.net/images/z1lab/logo/developed_by_white.svg" alt="z1lab - Soluções Digitais" height="30px">
                </a>
              </li>
              <li class="nav-item">
                <a href="https://z1lab.com.br" class="nav-link" target="_blank">Suporte</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
  import {BaseNav} from '@/components';
  import {ZoomCenterTransition} from 'vue2-transitions';

  export default {
    name: 'auth-layout',
    components: {
      BaseNav,
      ZoomCenterTransition
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        pageTransitionDuration: 200,
        year: new Date().getFullYear(),
        pageClass: 'login-page'
      };
    },
    computed: {
      title() {
        return `${this.$route.name} Page`;
      }
    },
    methods: {
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
      setBackgroundColor() {
        document.body.classList.add('bg-default');
      },
      removeBackgroundColor() {
        document.body.classList.remove('bg-default');
      },
      updateBackground() {
        if (!this.$route.meta.noBodyBackground) {
          this.setBackgroundColor();
        } else {
          this.removeBackgroundColor()
        }
      }
    },
    beforeDestroy() {
      this.removeBackgroundColor();
    },
    beforeRouteUpdate(to, from, next) {
      // Close the mobile menu first then transition to next page
      if (this.showMenu) {
        this.closeMenu();
        setTimeout(() => {
          next();
        }, this.menuTransitionDuration);
      } else {
        next();
      }
    },
    watch: {
      $route: {
        immediate: true,
        handler: function () {
          this.updateBackground()
        }
      }
    }
  };
</script>

<style lang="scss">
  $scaleSize: 0.8;
  @keyframes zoomIn8 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    100% {
      opacity: 1;
    }
  }

  .main-content .zoomIn {
    animation-name: zoomIn8;
  }

  @keyframes zoomOut8 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-content .zoomOut {
    animation-name: zoomOut8;
  }
</style>
