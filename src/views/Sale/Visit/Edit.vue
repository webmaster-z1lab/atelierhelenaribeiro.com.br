<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app>
      <div class="col-lg-6 col-5 text-right">
        <router-link :to="{name: 'sale.visit.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
          <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
          <span class="btn-inner--text">Voltar</span>
        </router-link>
        <base-button size="sm" type="primary" @click="edit_info = !edit_info">Editar Inf.</base-button>
      </div>
    </base-header-app>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12" v-if="edit_info">
          <card>
            <form class="needs-validation" @submit.prevent="submitForm">
              <div class="row">
                <div class="col-6">
                  <base-input label="Cliente" :error="getError('customer')" :valid="isValid('customer')">
                    <el-select v-model="visit.customer" filterable placeholder="Selecione o cliente." name="customer" v-validate="'required'" :class="[{'is-invalid': getError('customer')}]">
                      <el-option v-for="item in customers" :key="item.id" :label="item.company_name" :value="item.id"/>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-6">
                  <mask-input name="date" placeholder="##/##/####" label="Data da Visita" v-model="visit.date" :mask="'##/##/####'" :masked="true" validate="required|date_format:dd/MM/yyyy|before_today"/>
                </div>
                <div class="col-12">
                  <label class="form-control-label">Anotações</label>
                  <html-editor v-model="visit.annotation" name="annotation"></html-editor>
                </div>
              </div>

              <base-button type="primary" native-type="submit" size="sm">Salvar</base-button>
            </form>
          </card>
        </div>

        <div class="col-lg-4">
          <stats-card class="card-sale">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Pedido</h5>
                <span class="h2 font-weight-bold mb-0 text-white">R$ 0,00</span>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button type="default" size="sm" @click="component = 'create-sale'">Ver</base-button>
            </p>
          </stats-card>
        </div>
        <div class="col-lg-4">
          <stats-card class="card-payroll">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Consignado</h5>
                <span class="h2 font-weight-bold mb-0 text-white">0 <span class="small">produtos</span></span>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button type="default" size="sm" @click="component = 'create-payroll'">Ver</base-button>
            </p>
          </stats-card>
        </div>
        <div class="col-lg-4">
          <stats-card class="card-devolution">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Devolução</h5>
                <span class="h2 font-weight-bold mb-0 text-white">0 <span class="small">produtos</span></span>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button type="default" size="sm" @click="notify">Ver</base-button>
            </p>
          </stats-card>
        </div>

        <div class="col-12">
          <component :is="component" :key="component" :visit="id" v-if="component"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .card-sale {
    background: url('/img/svg/undraw_empty_cart_co35.svg') no-repeat right, linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
    background-size: 25%, 100% !important;
  }
  .card-payroll {
    background: url('/img/svg/undraw_shopping_eii3.svg') no-repeat right, linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important;
    background-size: 25%, 100% !important;
  }
  .card-devolution {
    background: url('/img/svg/undraw_empty_xct9.svg') no-repeat right, linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
    background-size: 25%, 100% !important;
  }
</style>

<script>
  import MaskInput from '@/components/App/Inputs/Mask';
  import HtmlEditor from '@/components/Inputs/HtmlEditor';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import CreateSale from './Sale/Create';
  import EditSale from './Sale/Edit';
  import CreatePayroll from './Payroll/Create';
  import EditPayroll from './Payroll/Edit';

  import {mapActions, mapState} from 'vuex';
  import {EDIT, GET} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui';
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
      HtmlEditor,
      MaskInput,
      [Select.name]: Select,
      [Option.name]: Option,
      CreateSale,
      EditSale,
      CreatePayroll,
      EditPayroll,
    },
    data () {
      return {
        edit_info: false,
        component: '',
        customers: []
      }
    },
    computed: {
      ...mapState('visit', {
        loading: state => state.loading,
        visit: state => state.visit
      })
    },
    async created() {
      await this.GET(this.id);
      await http.get('customers').then(response => this.customers = response.data).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('visit', [GET, EDIT]),
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.EDIT(this.visit).then(res => {
                  notifyVue(this.$notify, 'Visita atualizada com sucesso', 'success');
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
