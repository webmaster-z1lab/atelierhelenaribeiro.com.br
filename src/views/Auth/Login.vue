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
            <div class="card-header bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3">
                <small>Entrar com</small>
              </div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="img/icons/common/github.svg"></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="img/icons/common/google.svg"></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </div>
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Entre com suas credenciais</small>
              </div>
              <form role="form">
                <base-input class="mb-3" prepend-icon="ni ni-email-83" placeholder="Email" name="email"
                            v-model="auth.email" :error="errors.first('email')" :valid="errors.has('email')"
                            v-validate="'required|email'"/>

                <base-input class="mb-3" prepend-icon="ni ni-lock-circle-open" type="password" placeholder="Senha"
                            name="password" v-validate="'required|min:8'" :valid="errors.has('password')"
                            v-model="auth.password" :error="errors.first('password')" />

                <base-checkbox v-model="auth.rememberMe">Salvar meus dados</base-checkbox>

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
  import User from '@/models/User'
  import Loading from '@/components/Loading'

  import {http, ls} from "@/services";
  import {notifyVue, notifyError} from "@/utils";

  export default {
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Loading
    },
    data: () => ({
      loading: false,
      auth: {
        email: '',
        password: '',
        rememberMe: false
      }
    }),
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      singIn() {
        this.$validator.validateAll().then(
          res => {
            if (res) {
              let time_storage = null

              if (!this.auth.rememberMe) {
                time_storage = process.env.VUE_APP_SESSION_LIFETIME
                delete this.auth.rememberMe
              }

              this.changeLoading()

              http.post(`${process.env.VUE_APP_API_URL}/login`, this.auth)
                .then(async response => {
                  await User.create({data: response.data})

                  await ls.set('api_token', response.data.api_token, time_storage)
                  await ls.set('user_id', response.data.id, time_storage)

                  notifyVue(this.$notify, `${response.data.name}, Bem Vindo!`)

                  this.$router.push({name: 'Home'})
                })
                .catch(error => {
                  notifyError(this.$notify, error)
                  this.changeLoading()
                })
            }
          }
        )
      }
    }
  };
</script>

<style>
  .ct-example .btn {
    margin-top: .5rem;
    margin-bottom: .5rem;
  }
</style>
