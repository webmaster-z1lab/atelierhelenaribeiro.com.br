<template>
  <base-nav container-classes="container-fluid" class="navbar-top border-bottom navbar-expand" :class="{'bg-success navbar-dark': type === 'default'}">
    <!-- Navbar links -->
    <ul class="navbar-nav align-items-center ml-md-auto">
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div class="pr-3 sidenav-toggler" @click="toggleSidebar"
             :class="{active: $sidebar.showSidebar, 'sidenav-toggler-dark': type === 'default', 'sidenav-toggler-light': type === 'light'}">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
            <i class="sidenav-toggler-line"></i>
          </div>
        </div>
      </li>

      <notifications/>
      <systems/>
    </ul>
    <user-menu/>
  </base-nav>
</template>
<script>
  import {BaseNav} from '@/components';
  import UserMenu from './UserMenu'
  import Notifications from './Notifications'
  import Systems from './Systems'

  export default {
    name: 'default-navbar',
    components: {
      BaseNav,
      Systems,
      Notifications,
      UserMenu
    },
    props: {
      type: {
        type: String,
        default: 'default', // default|light
        description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
      }
    },
    methods: {
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
    }
  };
</script>
