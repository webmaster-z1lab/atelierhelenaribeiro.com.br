<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Paginated tables</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb/>
          </nav>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6" v-if="customer">
      <card>
        <div slot="header">
          <h3 class="mb-0">Editando Cliente</h3>
          <p class="text-sm mb-0">
            Modifique os dados abaixo para atualizar informações do cliente.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <h5 class="heading mb-4">Informações do Cliente</h5>

          <div class="form-row">
            <div class="col-lg-4">
              <base-input name="company_name" label="Nome da Empresa" v-model="customer.company_name" :error="getError('company_name')" :valid="isValid('company_name')"
                          v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <base-input name="trading_name" label="Nome Fantasia" v-model="customer.trading_name"/>
            </div>
            <div class="col-lg-4">
              <mask-input placeholder="000.000.000-00 ou 00.000.000/0000-00" name="document" label="Documento" v-model="customer.document"
                          :mask="['###.###.###-##', '##.###.###/####-##']" :error="getError('document')" :valid="isValid('document')" v-validate="'required|document'"/>
            </div>
          </div>
          <div class="form-row">
            <div class="col-lg-3">
              <base-input name="state_registration" label="Inscrição Estadual" v-model="customer.state_registration"/>
            </div>
            <div class="col-lg-3">
              <base-input name="municipal_registration" label="Inscrição Municipal" v-model="customer.municipal_registration"/>
            </div>
            <div class="col-lg-3">
              <base-input label="Tipo" :error="getError('status')" :valid="isValid('status')">
                <select name="status" class="form-control" v-model="customer.status" :class="[{'is-invalid': getError('status')}]" v-validate="'required'">
                  <option value="" selected>Selecione o status do cliente.</option>
                  <option value="active">Ativo</option>
                  <option value="stand_by">Pausado</option>
                  <option value="inactive">Desativado</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-3">
              <base-input label="Representante" :error="getError('seller')" :valid="isValid('seller')">
                <select name="seller" class="form-control" v-model="customer.seller" :class="[{'is-invalid': getError('seller')}]" v-validate="'required'">
                  <option value="" selected>Selecione um vendedor responsável.</option>
                  <option :value="seller.id" v-for="seller in sellers" :key="seller.id">{{seller.name}}</option>
                </select>
              </base-input>
            </div>
            <div class="col-12">
              <label class="form-control-label">Anotações</label>
              <html-editor v-model="customer.annotation"></html-editor>
            </div>
          </div>

          <hr class="my-4">
          <h5 class="heading mb-4">Dados de Contato</h5>

          <div class="form-row">
            <div class="col-lg-4">
              <base-input name="contact" label="Nome" v-model="customer.contact" placeholder="Nome para contato com a empresa."
                          :error="getError('contact')" :valid="isValid('contact')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <base-input name="email" label="Email" v-model="customer.email" :error="getError('email')" :valid="isValid('email')" v-validate="'required|email'"
                          placeholder="contato@example.com.br"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="customer.phones[0]" label=" 1" name="phone1" :validate="true"/>
            </div>
            <div class="col-lg-2">
              <phone-input :phone="customer.phones[1] || phone" label=" 2"/>
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

          <div class="form-row" v-for="(owner, key) in customer.owners" :key="owner.id">
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
                          :error="getError(`document_owners-${key}`)" :valid="isValid(`document_owners-${key}`)" v-validate="'required|cpf'"/>
            </div>
            <div class="col-lg-2">
              <mask-input :name="`birth_date-${key}`" placeholder="##/##/####" label="Data de Nascimento" v-model="owner.birth_date" :mask="'##/##/####'" :masked="true"
                          :error="getError(`birth_date-${key}`)" :valid="isValid(`birth_date-${key}`)" v-validate="'required|date_format:dd/MM/yyyy|before_today'"/>
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

          <address-inputs :address="customer.address" @loading="changeLoading"/>

          <hr class="my-4">
          <base-button type="primary" native-type="submit">Enviar</base-button>
          <base-button type="secondary" @click="$router.back()">Voltar</base-button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
  import Customer from '@/models/Customer'
  import MaskInput from '@/components/App/Inputs/Mask'
  import PhoneInput from '@/components/App/Inputs/Phone'
  import HtmlEditor from '@/components/Inputs/HtmlEditor'
  import AddressInputs from '@/components/App/Address'
  import crudSettingsMixin from '@/mixins/crud-settings'

  import {notifyVue, notifyError} from "@/utils";
  import {http} from "@/services";

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
      MaskInput,
      PhoneInput,
      HtmlEditor,
      AddressInputs
    },
    data () {
      return {
        loading: true,
        sellers: [],
        phone: {
          number: '',
          is_whatsapp: false
        },
        customer: Customer.find(this.id)
      }
    },
    async created() {
      await http.get(process.env.VUE_APP_API_URL + '/employees', {search: 'seller'}).then(
        async response => {
          this.sellers = response.data
        }
      ).catch(error => console.dir(error));

      if (!this.customer) this.customer = await Customer.$get({params: {id: this.id}});

      this.changeLoading();
    },
    methods: {
      addOwner() {
        this.customer.owners.push({
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
        this.customer.owners.splice(key, 1)
      },
      submitForm() {
        try {
          this.$validator.validateAll().then(
            res => {
              if (res) {
                this.changeLoading();

                if (this.phone.number) this.customer.phones[1] = this.phone;

                Customer.$update({params: {id: this.id}, data: this.customer})
                  .then(res => {
                    notifyVue(this.$notify, 'Cliente atualizado com sucesso', 'success')
                  })
                  .catch(error => notifyError(this.$notify, error))
                  .finally(this.changeLoading())
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
