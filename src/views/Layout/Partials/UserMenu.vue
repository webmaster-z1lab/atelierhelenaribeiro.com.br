<template>
  <ul class="navbar-nav align-items-center ml-auto ml-md-0">
    <loading :loading="loading"/>
    <li class="nav-item dropdown" :class="[{ show: isOpen }]">
      <a class="nav-link pr-0" href="javascript:;" role="button" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen" @click="toggleDropDown" v-click-outside="closeDropDown">
        <div class="media align-items-center">
            <span class="avatar avatar-sm rounded-circle bg-dark">
              <i class="far fa-user"></i>
<!--              <img alt="Image placeholder" src="/img/theme/team-4.jpg">-->
            </span>
          <div class="media-body ml-2 d-none d-lg-block">
            <span class="mb-0 text-sm  font-weight-bold">{{user.name}}</span>
          </div>
        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-right" :class="[{ show: isOpen }]">
        <div class="dropdown-header noti-title">
          <h6 class="text-overflow m-0">Bem Vindo!</h6>
        </div>
        <!--<a href="javascript:;" class="dropdown-item">
          <i class="ni ni-single-02"></i>
          <span>Meu Perfil</span>
        </a>-->
        <a href="https://z1lab.com.br" class="dropdown-item" target="_blank">
          <i class="far fa-life-ring"></i>
          <span>Suporte</span>
        </a>
        <div class="dropdown-divider"></div>
        <a href="javascript:;" class="dropdown-item" @click="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Sair</span>
        </a>
      </div>
    </li>
  </ul>
</template>

<script>
  import {http, ls} from "@/services";
  import {notifyError} from "@/utils";

  import Loading from '@/components/App/Loading'

  import {mapActions, mapState} from 'vuex';
  import {LOGOUT} from "@/store/root-const";

  export default {
    name: 'user-menu',
    data() {
      return {
        isOpen: false
      };
    },
    components: {
      Loading
    },
    computed: {
      ...mapState({
        user: state => state.user,
        loading: state => state.loading
      })
    },
    methods: {
      ...mapActions([LOGOUT]),
      toggleDropDown() {
        this.isOpen = !this.isOpen;
      },
      closeDropDown() {
        this.isOpen = false;
      },
      logout() {
        this.LOGOUT().then(res => this.$router.push({name: 'login'})).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
