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
      <card>
        <div slot="header">
          <h3 class="mb-0">Criando Funcionário</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo para adicionar um novo funcionário ao sistema.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <h5 class="heading mb-4">Informações do Funcionário</h5>

          <div class="form-row">
            <div class="col-lg-4">
              <base-input name="name" label="Nome" v-model="employee.name" :error="getError('name')" :valid="isValid('name')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <base-input type="email" name="email" label="Email" v-model="employee.email" :error="getError('email')" :valid="isValid('email')" v-validate="'required|email'"/>
            </div>
            <div class="col-lg-4">
              <mask-input placeholder="000.000.000-00" name="document" label="CPF" v-model="employee.document" :mask="'###.###.###-##'"
                          :error="getError('document')" :valid="isValid('document')" v-validate="'required|cpf'"/>
            </div>
          </div>
          <div class="form-row">
            <div class="col-lg-4">
              <mask-input placeholder="(00) 00000-0000" name="phone" label="Telefone" v-model="employee.phone" :mask="['(##) #####-####', '(##) ####-####']"
                          :append-icon="employee.is_whatsapp ? 'fab fa-whatsapp' : 'fas fa-phone'"
                          :error="getError('phone')" :valid="isValid('phone')" v-validate="'required|phone'"/>
            </div>
            <div class="col-lg-4">
              <base-input label="Tipo">
                <select class="form-control" v-model="employee.type">
                  <option value="admin">Administrador</option>
                  <option value="seller">Vendedor</option>
                  <option value="dressmaker">Costureira</option>
                </select>
              </base-input>
            </div>
          </div>
          <div class="form-row">
            <div class="col-lg-4">
              <base-checkbox class="mb-3" v-model="employee.is_whatsapp">
                Whatsapp
              </base-checkbox>
            </div>
          </div>
          <hr class="my-4">

          <h5 class="heading mb-4">Endereço</h5>
          <p class="text-sm text-muted mt--3">Informe um cep abaixo.
            <a class="text-primary" href="http://www.buscacep.correios.com.br/sistemas/buscacep/" target="_blank">
              <i class="fas fa-external-link-alt"></i> Não sei o CEP!
            </a>
          </p>

          <address-inputs :address="employee.address" @loading="changeLoading"/>

          <hr class="my-4">
          <base-button type="primary" native-type="submit">Enviar</base-button>
          <base-button type="secondary" @click="$router.back()">Voltar</base-button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
  import Employee from '@/models/Employee'
  import MaskInput from '@/components/App/Inputs/Mask'
  import AddressInputs from '@/components/App/Address'
  import crudSettingsMixin from '@/mixins/crud-settings'

  import {notifyVue, notifyError} from "@/utils";

  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb'

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MaskInput,
      AddressInputs,
      RouteBreadCrumb
    },
    data () {
      return {
        employee: new Employee()
      }
    },
    methods: {
      submitForm() {
        this.$validator.validateAll().then(
          async res => {
            if (res) {
              this.changeLoading();

              await Employee.$create({data: this.employee})
                .then(response => {
                  notifyVue(this.$notify, 'Funcionário Criado com sucesso', 'success');
                  this.$router.push({name: 'employee.show', params: {id: response.id}})
                })
                .catch(error => notifyError(this.$notify, error))
                .finally(this.changeLoading());
            }
          }
        )
      }
    }
  };
</script>
