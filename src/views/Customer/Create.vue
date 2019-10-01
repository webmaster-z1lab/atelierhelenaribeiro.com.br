<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Adicionar cliente</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo para adicionar um novo cliente ao sistema
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <h5 class="heading mb-4">Informações do Cliente</h5>

          <div class="form-row">
            <div class="col-lg-4">
              <base-input name="company_name" label="Nome da Empresa" placeholder="Confecção LTDA" v-model="company_name" :error="getError('company_name')" :valid="isValid('company_name')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <base-input name="trading_name" label="Nome Fantasia" placeholder="Confecção da Maria"  v-model="trading_name"/>
            </div>
            <div class="col-lg-4">
              <mask-input placeholder="000.000.000-00 | 00.000.000/0000-00" name="document" label="Documento (CPF ou CNPJ)" v-model="document" :mask="['###.###.###-##', '##.###.###/####-##']" validate="required|document"/>
            </div>
          </div>
          <div class="form-row">
            <div class="col-lg-3">
              <base-input name="state_registration" label="Inscrição Estadual" placeholder="000.000.000/0000" v-model="state_registration"/>
            </div>
            <div class="col-lg-3">
              <base-input name="municipal_registration" label="Inscrição Municipal" placeholder="0.000.000-0" v-model="municipal_registration"/>
            </div>
            <div class="col-lg-3">
              <base-input label="Status" :error="getError('status')" :valid="isValid('status')">
                <select name="status" class="form-control" v-model="status" :class="[{'is-invalid': getError('status')}]" v-validate="'required'">
                  <option value="" selected>Selecione o status do cliente.</option>
                  <option value="active">Ativo</option>
                  <option value="stand_by">Pausado</option>
                  <option value="inactive">Desativado</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-3">
              <base-input label="Representante" :error="getError('seller')" :valid="isValid('seller')">
                <el-select v-model="seller" filterable placeholder="Selecione o representante do cliente." name="seller" v-validate="'required'" :class="[{'is-invalid': getError('seller')}]">
                  <el-option v-for="seller in sellers" :key="seller.id" :label="seller.name" :value="seller.id"/>
                </el-select>
              </base-input>
            </div>
            <div class="col-12">
              <label class="form-control-label">Anotações</label>
              <html-editor v-model="annotation"></html-editor>
            </div>
          </div>

          <hr class="my-4">
          <h5 class="heading mb-4">Dados de Contato</h5>

          <div class="form-row">
            <div class="col-lg-4">
              <base-input name="contact" label="Nome" v-model="contact" placeholder="Nome para contato com a empresa." :error="getError('contact')" :valid="isValid('contact')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <base-input name="email" label="Email" v-model="email" :error="getError('email')" :valid="isValid('email')" v-validate="'required|email'" placeholder="contato@example.com.br"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="phone1" label=" 1" name="phone1" :validate="true"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="phone2" label=" 2"/>
            </div>
          </div>

          <hr class="my-4">
          <div class="row">
            <div class="col">
              <h5 class="heading mb-4">Dados do(s) Proprietário(s)</h5>
            </div>
            <div class="col text-right">
              <base-button type="primary" size="sm" @click="addOwner"><i class="fas fa-user-plus"></i> Adicionar</base-button>
            </div>
          </div>

          <div class="form-row" v-for="(owner, key) in owners" :key="key">
            <div class="col-lg-3">
              <base-input :name="`name_owners-${key}`" label="Nome" v-model="owner.name" placeholder="Nome do proprietário."
                          :error="getError(`name_owners-${key}`)" :valid="isValid(`name_owners-${key}`)" v-validate="'required'"/>
            </div>
            <div class="col-lg-2">
              <base-input :name="`email_owners-${key}`" type="email" label="Email" v-model="owner.email" placeholder="contato@example.com.br"
                          :error="getError(`email_owners-${key}`)" :valid="isValid(`email_owners-${key}`)" v-validate="'required|email'"/>
            </div>
            <div class="col-lg-2">
              <mask-input :name="`document_owners-${key}`" placeholder="000.000.000-00" label="CPF" v-model="owner.document" :mask="'###.###.###-##'"
                          :error="getError(`document_owners-${key}`)" :valid="isValid(`document_owners-${key}`)" v-validate="'cpf'"/>
            </div>
            <div class="col-lg-2">
              <mask-input :name="`birth_date-${key}`" placeholder="DD/MM/AAAA" label="Data de Nascimento" v-model="owner.birth_date" :mask="'##/##/####'" :masked="true"
                          :error="getError(`birth_date-${key}`)" :valid="isValid(`birth_date-${key}`)" v-validate="'date_format:dd/MM/yyyy|before_today'"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="owner.phone" :name="`phone_owners-${key}`" :validate="true"/>
            </div>
            <div class="col-lg-1 align-self-center text-right" v-if="key">
              <base-button type="danger" class="d-none d-lg-block" @click="removeOwner(key)"><i class="fas fa-user-times"></i></base-button>
              <base-button type="danger" class="btn-block d-lg-none"><i class="fas fa-user-times"></i></base-button>
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
  import HtmlEditor from '@/components/Inputs/HtmlEditor';
  import AddressInputs from '@/components/App/Address';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState} from 'vuex';
  import {CREATE} from "@/store/modules/customer/customer-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui';
  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MaskInput,
      PhoneInput,
      HtmlEditor,
      AddressInputs,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data () {
      return {
        company_name: '',
        trading_name: '',
        document: '',
        state_registration: '',
        municipal_registration: '',
        email: '',
        contact: '',
        status: 'active',
        annotation: '',
        owners: [
          {
            name: '',
            document: '',
            birth_date: '',
            email: '',
            phone: {
              number: '',
              is_whatsapp: false
            }
          }
        ],
        address: {
          postal_code: '',
          state: '',
          district: '',
          city: '',
          street: '',
          number: '',
          complement: ''
        },
        phone1: {
          number: '',
          is_whatsapp: false
        },
        phone2: {
          number: '',
          is_whatsapp: false
        },
        sellers: [],
        seller: '',
      }
    },
    computed: {
      ...mapState('customer', {
        loading: state => state.loading
      })
    },
    async created() {
      await http.get('employees', {search: 'seller'}).then(response => this.sellers = response.data).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('customer', [CREATE]),
      addOwner() {
        this.owners.push({
          name: '',
          document: '',
          birth_date: '',
          email: '',
          phone: {
            number: '',
            is_whatsapp: false
          }
        })
      },
      removeOwner(key) {
        this.owners.splice(key, 1)
      },
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                const {
                  company_name,
                  trading_name,
                  document,
                  state_registration,
                  municipal_registration,
                  email,
                  contact,
                  status,
                  annotation,
                  owners,
                  address,
                  seller,
                  phone1,
                  phone2
                } = this;

                this.CREATE({
                  company_name,
                  trading_name,
                  document,
                  state_registration,
                  municipal_registration,
                  email,
                  contact,
                  status,
                  annotation,
                  owners,
                  address,
                  seller,
                  phones: phone2.number ? [phone1, phone2] : [phone1]
                }).then(response => {
                    notifyVue(this.$notify, 'Cliente criado com sucesso', 'success');
                    this.$router.push({name: 'customer.show', params: {id: response.id}})
                }).catch(error => notifyError(this.$notify, error));
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

<style>
  @media (min-width: 992px) {
    .d-lg-block {
      display: inline !important;
    }
  }
</style>
