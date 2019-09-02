<template>
  <div class="wrapper">
    <notifications/>
    <side-bar logo="/img/brand/chr-icon.png">
      <template slot-scope="props" slot="links">
        <sidebar-item :link="{name: 'Home', path: '/home', icon: 'fas fa-home text-primary'}"/>
        <sidebar-item :link="{name: 'Funcionários', icon: 'fas fa-users-cog text-dark', path: '/employees'}"/>
        <sidebar-item :link="{name: 'Clientes', icon: 'fas fa-users text-info', path: '/customers'}"/>
        <sidebar-item :link="{name: 'Catálogo',icon: 'fas fa-book-open text-danger'}">
          <sidebar-item :link="{ name: 'Modelos', path: '/catalog/templates' }"/>
        </sidebar-item>
        <sidebar-item :link="{name: 'Estoque',icon: 'fas fa-boxes text-warning'}">
          <sidebar-item :link="{ name: 'Produtos', path: '/stock/products' }"/>
        </sidebar-item>
        <sidebar-item :link="{name: 'Venda',icon: 'fas fa-cart-arrow-down text-success'}">
          <sidebar-item :link="{ name: 'Romaneiro', path: '/sale/packing' }"/>
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <default-navbar :type="$route.meta.navbarType"/>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <router-view/>
        </fade-transition>
      </div>

      <default-footer v-if="!$route.meta.hideFooter"/>
    </div>
  </div>
</template>

<script>
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DefaultNavbar from './Partials/DefaultNavbar';
  import DefaultFooter from './Partials/DefaultFooter';
  import {FadeTransition} from 'vue2-transitions';

  export default {
    name: 'default-layout',
    components: {
      DefaultFooter,
      DefaultNavbar,
      FadeTransition
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('scrollbar-inner');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>

<style>
  #nprogress .bar {
    z-index: 2000 !important;
  }
</style>
