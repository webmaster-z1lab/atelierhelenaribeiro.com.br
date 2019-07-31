<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Paginated tables</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb/>
          </nav>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <h3 class="mb-0">Criando Funcionário</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo para adicionar um novo funcionário ao sistema.
          </p>
        </div>
        <div class="col-12">
          <div class="row">
            <base-input class="col-4" name="name" label="Nome" v-model="employee.name" :error="getError('name')" :valid="isValid('name')"
                        v-validate="'required'" required/>

            <base-input class="col-4" type="email" name="email" label="Email" v-model="employee.email" :error="getError('email')" :valid="isValid('email')"
                        v-validate="'required|email'" required/>

            <base-input class="col-4" name="document" label="CPF" v-model="employee.document" :error="getError('document')" :valid="isValid('document')"
                        v-validate="'required'" required/>

            <mask-input class="col-4" placeholder="(00) 00000-0000" name="phone" label="Telefone" v-model="employee.phone" mask="['(##) #####-####', '(##) ####-####']"
                        :error="getError('phone')" :valid="isValid('phone')" v-validate="'required|phone'" required/>

            <div class="col-12">
              <fieldset class="margin-fieldset my-2">
                <legend class="h3 header-title">Endereço</legend>
                <p class="text-sm">
                  Informe um cep abaixo.
                  <a class="text-primary" href="http://www.buscacep.correios.com.br/sistemas/buscacep/" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Não sei o meu CEP
                  </a>
                </p>

                <address-inputs :address="employee.address" @loading="changeLoading"/>
              </fieldset>
            </div>
          </div>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">

        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import Employee from '@/models/Employee'
  import Loading from '@/components/App/Loading'
  import MaskInput from '@/components/App/Inputs/Mask'
  import AddressInputs from '@/components/App/Address'

  import {http, ls} from "@/services";
  import {notifyVue, notifyError} from "@/utils";

  import { BasePagination } from '@/components';
  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb'
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';

  export default {
    name: 'create',
    components: {
      Loading,
      MaskInput,
      AddressInputs,
      BasePagination,
      RouteBreadCrumb,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        loading: false,
        validated: false,
        employee: new Employee()
      }
    },
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      getError(name){
        return this.errors.first(name)
      },
      isValid(name) {
        return this.validated && !this.errors.has(name);
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
