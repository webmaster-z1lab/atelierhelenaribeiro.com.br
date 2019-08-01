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
                        v-validate="'required'"/>

            <base-input class="col-4" type="email" name="email" label="Email" v-model="employee.email" :error="getError('email')" :valid="isValid('email')"
                        v-validate="'required|email'"/>

            <mask-input class="col-4" placeholder="000.000.000-00" name="document" label="CPF" v-model="employee.document" mask="###.###.###-##"
                        :error="getError('document')" :valid="isValid('document')" v-validate="'required|cpf'"/>

            <div class="col-4">
              <base-checkbox class="mb-3" v-model="employee.is_whatsapp">
                Telefone é Whatsapp?
              </base-checkbox>
            </div>
            <div class="offset-8"></div>

            <mask-input class="col-4" placeholder="(00) 00000-0000" name="phone" label="Telefone" v-model="employee.phone" :mask="['(##) #####-####', '(##) ####-####']"
                        :error="getError('phone')" :valid="isValid('phone')" v-validate="'required|phone'"/>

            <base-input label="Tipo" class="col-4">
              <select class="form-control" v-model="employee.type">
                <option value="admin">Administrador</option>
                <option value="seller">Vendedor</option>
                <option value="dressmaker">Costureira</option>
              </select>
            </base-input>

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
        <div slot="footer" class="text-right">
          <base-button type="primary" @click="submitForm">Enviar</base-button>
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

  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb'

  export default {
    name: 'create',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Loading,
      MaskInput,
      AddressInputs,
      RouteBreadCrumb
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
      getError(name) {
        return this.errors.first(name)
      },
      isValid(name) {
        return this.validated && !this.errors.has(name);
      },
      submitForm() {
        this.$validator.validateAll().then(
          res => {
            if (res) {
              this.changeLoading()

              Employee.$create({data: this.employee})
                .then(res => {
                  //this.$emit('')
                  notifyVue(this.$notify, 'Funcionário Criado com sucesso', 'success')
                })
                .catch(error => notifyError(this.$notify, error))
                .finally(this.changeLoading())
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
