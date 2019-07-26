<template>
  <ul class="navbar-nav align-items-center ml-auto ml-md-0">
    <loading :loading="loading"/>
    <li class="nav-item dropdown" :class="[{ show: isOpen }]">
      <a class="nav-link pr-0" href="javascript:;" role="button" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen"
         @click="toggleDropDown" v-click-outside="closeDropDown">
        <div class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img alt="Image placeholder" src="img/theme/team-4.jpg">
            </span>
          <div class="media-body ml-2 d-none d-lg-block">
            <span class="mb-0 text-sm  font-weight-bold">John Snow</span>
          </div>
        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-right" :class="[{ show: isOpen }]">
        <div class="dropdown-header noti-title">
          <h6 class="text-overflow m-0">Welcome!</h6>
        </div>
        <a href="javascript:;" class="dropdown-item">
          <i class="ni ni-single-02"></i>
          <span>My profile</span>
        </a>
        <a href="javascript:;" class="dropdown-item">
          <i class="ni ni-settings-gear-65"></i>
          <span>Settings</span>
        </a>
        <a href="javascript:;" class="dropdown-item">
          <i class="ni ni-calendar-grid-58"></i>
          <span>Activity</span>
        </a>
        <a href="javascript:;" class="dropdown-item">
          <i class="ni ni-support-16"></i>
          <span>Support</span>
        </a>
        <div class="dropdown-divider"></div>
        <a href="javascript:;" class="dropdown-item" @click="logout()">
          <i class="ni ni-user-run"></i>
          <span>Sair</span>
        </a>
      </div>
    </li>
  </ul>
</template>

<script>
  import {http, ls} from "@/services";
  import {notifyError} from "@/utils";

  import Loading from '@/components/Loading'

  export default {
    name: 'systems',
    data() {
      return {
        loading: false,
        isOpen: false
      };
    },
    components: {
      Loading
    },
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      toggleDropDown() {
        this.isOpen = !this.isOpen;
      },
      closeDropDown() {
        this.isOpen = false;
      },
      logout() {
        http.post(`${process.env.VUE_APP_API_URL}/logout`, {})
          .then(async response => {
            await ls.clear()

            this.$router.push({name: 'Welcome'})
          })
          .catch(error => {
            notifyError(this.$notify, error)
            this.changeLoading()
          })
      }
    }
  };
</script>
