<template>
  <div>
    <loading :loading="loading"/>
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="container">
        <div class="header-body text-center mb-7">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <h1 class="text-white">Bem Vindo!</h1>
              <p class="text-lead text-white">Use suas credenciais para fazer login abaixo.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>

    <div class="container mt--8 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Entre com suas credenciais</small>
              </div>
              <form role="form">
                <base-input class="mb-3" prepend-icon="ni ni-email-83" placeholder="Email" name="email"
                            v-model="auth.email" :error="getError('email')" :valid="isValid('email')"
                            v-validate="'required|email'"/>

                <base-input class="mb-3" prepend-icon="ni ni-lock-circle-open" type="password" placeholder="Senha"
                            name="password" v-validate="'required|min:8'" :valid="isValid('password')"
                            v-model="auth.password" :error="getError('password')" @keyup.enter="singIn" />

                <base-checkbox v-model="auth.remember">Salvar meus dados</base-checkbox>

                <div class="text-center">
                  <base-button type="primary" class="my-4" @click="singIn">Entrar</base-button>
                </div>
              </form>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/dashboard" class="text-light">
                <small>Esqueceu a senha?</small>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Loading from '@/components/App/Loading'
  import {LOGIN} from '@/store/root-const'

  import {http, ls} from "@/services";
  import {notifyVue, notifyError} from "@/utils";

  export default {
    name: 'login',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Loading
    },
    data: () => ({
      validated: false,
      auth: {
        email: '',
        password: '',
        remember: false
      }
    }),
    computed: {
      ...mapState({
        loading: state => state.loading
      })
    },
    methods: {
      ...mapActions(['LOGIN']),
      getError(name) {
        return this.errors.first(name)
      },
      isValid(name) {
        return this.validated && !this.errors.has(name);
      },
      singIn() {
        try {
          this.$validator.validateAll().then(
            res => {
              if (res) {
                this.LOGIN(this.auth).then(res => {
                  notifyVue(this.$notify, `${res.name}, Bem Vindo!`);

                  if(this.$route.params.nextUrl) {
                    this.$router.push(this.$route.params.nextUrl)
                  } else {
                    this.$router.push({name: 'dashboard'});
                  }
                });
              }
            }
          ).catch(error => notifyError(this.$notify, error))
        } finally {
          this.validated = true;
        }
      }
    }
  };
</script>
