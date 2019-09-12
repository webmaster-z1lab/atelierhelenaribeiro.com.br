<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

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
            <div class="col-lg-3">
              <base-input name="name" label="Nome" v-model="name" :error="getError('name')" :valid="isValid('name')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <base-input type="email" name="email" label="Email" v-model="email" :error="getError('email')" :valid="isValid('email')" v-validate="'email'"/>
            </div>
            <div class="col-lg-3">
              <mask-input placeholder="000.000.000-00" name="document" label="CPF" v-model="document" :mask="'###.###.###-##'" validate="required|cpf"/>
            </div>
            <div class="col-lg-3">
              <base-input name="identity" label="Identidade" v-model="identity" :error="getError('identity')" :valid="isValid('identity')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <base-input name="work_card" label="Carteira de Trabalho" v-model="work_card" :error="getError('work_card')" :valid="isValid('work_card')" v-validate="'required'"/>
            </div>
            <div class="col-lg-3">
              <mask-input name="birth_date" placeholder="##/##/####" label="Data de Nascimento" v-model="birth_date" :mask="'##/##/####'" :masked="true"
                          validate="required|date_format:dd/MM/yyyy|before_today"/>
            </div>
            <div class="col-lg-3">
              <mask-input name="admission_date" placeholder="##/##/####" label="Data de Admissão" v-model="admission_date" :mask="'##/##/####'" :masked="true"
                          validate="required|date_format:dd/MM/yyyy|before_today"/>
            </div>
            <div class="col-lg-3">
              <money-input label="Remuneração" v-model="remuneration" name="remuneration"/>
            </div>
            <div class="col-lg-4">
              <phone-input :phone="phone" name="phone" :validate="true"/>
            </div>
            <div class="col-lg-4">
              <base-input label="Cargo" :error="getError('type')" :valid="isValid('type')">
                <select class="form-control" name="type" v-model="type" :class="[{'is-invalid': getError('type')}]" v-validate="'required'">
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
          <h5 class="heading mb-4">Endereço</h5>
          <p class="text-sm text-muted mt--3">Informe um cep abaixo.
            <a class="text-primary" href="http://www.buscacep.correios.com.br/sistemas/buscacep/" target="_blank">
              <i class="fas fa-external-link-alt"></i> Não sei o CEP!
            </a>
          </p>

          <address-inputs :address="address" @loading="changeLoading"/>

          <hr class="my-4">
          <base-button type="primary" native-type="submit">Enviar</base-button>
          <base-button type="secondary" @click="$router.back()">Voltar</base-button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
  import MaskInput from '@/components/App/Inputs/Mask';
  import PhoneInput from '@/components/App/Inputs/Phone';
  import MoneyInput from '@/components/App/Inputs/Money';
  import AddressInputs from '@/components/App/Address';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState} from 'vuex';
  import {CREATE} from "@/store/modules/employee/employee-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui';

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MoneyInput,
      MaskInput,
      PhoneInput,
      AddressInputs,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data () {
      return {
        name: '',
        email: '',
        document: '',
        birth_date: '',
        admission_date: '',
        identity: '',
        work_card: '',
        remuneration: 0,
        type: '',
        phone: {is_whatsapp: false, number: ''},
        address: {
          postal_code: '',
          state: '',
          district: '',
          city: '',
          street: '',
          number: '',
          complement: ''
        }
      }
    },
    computed: {
      ...mapState('employee', {
        loading: state => state.loading
      })
    },
    methods: {
      ...mapActions('employee', [CREATE]),
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                const {name, email, document, birth_date, admission_date, identity, work_card, remuneration, type, phone, address} = this;

                this.CREATE({name, email, document, birth_date, admission_date, identity, work_card, remuneration, type, phone, address})
                  .then(response => {
                    notifyVue(this.$notify, 'Funcionário criado com sucesso', 'success');
                    this.$router.push({name: 'employee.show', params: {id: response.id}})
                  })
                  .catch(error => notifyError(this.$notify, error));
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
