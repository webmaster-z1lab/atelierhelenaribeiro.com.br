<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="employee">
      <card>
        <div slot="header">
          <h3 class="mb-0">Editando Funcionário</h3>
          <p class="text-sm mb-0">
            Modifique os dados abaixo para atualizar informações do funcionário.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <h6 class="heading-small text-muted mb-4">Informações do Funcionário</h6>

          <div class="form-row">
            <div class="col-lg-3">
              <base-input name="name" label="Nome" v-model="employee.name" :error="getError('name')" :valid="isValid('name')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <base-input type="email" name="email" label="Email" v-model="employee.email" :error="getError('email')" :valid="isValid('email')" v-validate="'email'"/>
            </div>
            <div class="col-lg-2">
              <mask-input placeholder="000.000.000-00" name="document" label="CPF" v-model="employee.document" :mask="'###.###.###-##'"
                          :error="getError('document')" :valid="isValid('document')" v-validate="'required|cpf'"/>
            </div>
            <div class="col-lg-3">
              <base-input name="identity" label="Identidade" v-model="employee.identity" :error="getError('identity')" :valid="isValid('identity')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <base-input name="work_card" label="Carteira de Trabalho" v-model="employee.work_card" :error="getError('work_card')" :valid="isValid('work_card')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <mask-input name="birth_date" placeholder="##/##/####" label="Data de Nascimento" v-model="employee.birth_date" :mask="'##/##/####'" :masked="true"
                          :error="getError('birth_date')" :valid="isValid('birth_date')" v-validate="'required|date_format:dd/MM/yyyy|before_today'"/>
            </div>
            <div class="col-lg-3">
              <mask-input name="admission_date" placeholder="##/##/####" label="Data de Admissão" v-model="employee.admission_date" :mask="'##/##/####'" :masked="true"
                          :error="getError('admission_date')" :valid="isValid('admission_date')" v-validate="'required|date_format:dd/MM/yyyy|before_today'"/>
            </div>
            <div class="col-lg-3">
              <money-input label="Remuneração" v-model="employee.remuneration" name="remuneration"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="employee.phone" name="phone" :validate="true"/>
            </div>
            <div class="col-lg-2">
              <base-input label="Cargo" :error="getError('type')" :valid="isValid('type')">
                <select class="form-control" v-model="employee.type" :class="[{'is-invalid': getError('type')}]" v-validate="'required'">
                  <option value="" selected>Selecione o tipo do funcionário.</option>
                  <option value="admin">Administrador</option>
                  <option value="seller">Vendedor</option>
                  <option value="dressmaker">Costureira</option>
                  <option value="dressmaker_assistant">Auxiliar de Costura</option>
                  <option value="embroiderer">Bordadeira</option>
                  <option value="embroiderer_assistant">Auxiliar de Bordadeira</option>
                  <option value="modelist">Modelista</option>
                  <option value="office_assistant">Auxiliar de Escritório</option>
                </select>
              </base-input>
            </div>
          </div>

          <hr class="my-4">
          <h6 class="heading-small text-muted mb-4">Endereço</h6>
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
  import MoneyInput from '@/components/App/Inputs/Money'
  import PhoneInput from '@/components/App/Inputs/Phone'
  import AddressInputs from '@/components/App/Address'
  import crudSettingsMixin from '@/mixins/crud-settings'

  import {notifyVue, notifyError} from "@/utils";

  export default {
    name: 'edit',
    mixins: [crudSettingsMixin],
    props:{
      id: {
        type: String,
        required: true
      }
    },
    components: {
      MoneyInput,
      MaskInput,
      PhoneInput,
      AddressInputs
    },
    data () {
      return {
        loading: true,
        employee: Employee.find(this.id)
      }
    },
    async created() {
      if (!this.employee) this.employee = await Employee.$get({params: {id: this.id}});

      this.changeLoading();
    },
    methods: {
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                await this.changeLoading();

                await Employee.$update({params: {id: this.id}, data: this.employee})
                  .then(res => notifyVue(this.$notify, 'Funcionário atualizado com sucesso', 'success'))
                  .catch(error => notifyError(this.$notify, error));

                this.changeLoading()
              }
            }
          )
        } finally {
          this.validated = true;
        }
      }
    }
  };
</script>
