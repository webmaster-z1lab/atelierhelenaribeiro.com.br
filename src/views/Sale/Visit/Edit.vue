<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app>
      <div class="col-lg-6 col-5 text-right">
        <router-link :to="{name: 'sale.visit.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
          <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
          <span class="btn-inner--text">Voltar</span>
        </router-link>
        <base-button size="sm" type="primary" @click="edit_info = true">Editar Visita</base-button>
      </div>
    </base-header-app>

    <div class="container-fluid mt--6">
      <div class="row" v-if="component">
        <div class="col-lg-4">
          <stats-card class="card-sale">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Pedido</h5>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button :type="(component === 'create-sale' || component === 'edit-sale') ? 'danger' : 'default'" size="sm" @click="CHANGE_COMPONENT(!emptySale ? 'edit-sale' : 'create-sale')">
                {{(component === 'create-sale' || component === 'edit-sale') ? 'Você está aqui!' : !emptySale ? 'Editar Pedido' : 'Criar Pedido'}}
              </base-button>
            </p>
          </stats-card>
        </div>
        <div class="col-lg-4">
          <stats-card class="card-payroll">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Consignado</h5>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button :type="(component === 'create-payroll' || component === 'edit-payroll') ? 'danger' : 'default'" size="sm" @click="CHANGE_COMPONENT(!emptyPayroll ? 'edit-payroll' : 'create-payroll')">
                {{(component === 'create-payroll' || component === 'edit-payroll') ? 'Você está aqui!' : !emptyPayroll ? 'Editar Consignado' : 'Criar Consignado'}}
              </base-button>
            </p>
          </stats-card>
        </div>
        <div class="col-lg-4">
          <stats-card class="card-devolution">
            <div class="row">
              <div class="col">
                <h5 class="card-title text-uppercase text-muted mb-0 text-white">Devolução</h5>
              </div>
            </div>
            <p class="mt-3 mb-0 text-sm">
              <base-button type="default" size="sm" disabled>Ver</base-button>
            </p>
          </stats-card>
        </div>

        <div class="col-12">
          <component :is="component" :key="component" :visit="visit" v-if="component"/>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-lg-4">
          <card gradient="success" header-classes="bg-transparent" footer-classes="bg-transparent" body-classes="px-lg-7" class="card-pricing border-0 text-center mb-4">

            <div slot="header">
              <div class="row">
                <div class="col-auto">
                  <h3 class="text-uppercase ls-1 text-white py-3 mb-0">Pedido</h3>
                </div>
                <div class="col text-right">
                  <el-tooltip content="Ver Detalhes" placement="top">
                    <base-button class="icon icon-shape bg-white text-dark rounded-circle shadow" :disabled="emptySale" @click="details_sale = true">
                      <i class="fas fa-search-plus fa-lg"></i>
                    </base-button>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <img src="/img/svg/undraw_empty_cart_co35.svg" alt="" width="50%">
            <div class="mt-3" v-if="emptySale">
              <span class="pl-2 text-sm text-white">Nenhum pedido foi feito!</span>
            </div>

            <div class="mt-3" v-else>
              <div class="display-2 text-white mt-3">{{visit.sale.price | currency}}</div>
              <span class=" text-white">Valor Total Do Pedido</span>
            </div>

            <base-button slot="footer" type="primary" v-if="emptySale" @click="CHANGE_COMPONENT('create-sale')">Criar Pedido</base-button>
            <div class="row" slot="footer" v-else>
              <div class="col">
                <base-button type="warning" @click="CHANGE_COMPONENT('edit-sale')">Editar Pedido</base-button>
              </div>
              <div class="col">
                <base-button type="danger" @click="removeSale">Apagar Pedido</base-button>
              </div>
            </div>
          </card>
        </div>
        <div class="col-lg-4">
          <card gradient="primary" header-classes="bg-transparent" footer-classes="bg-transparent" body-classes="px-lg-7" class="card-pricing border-0 text-center mb-4">

            <div slot="header">
              <div class="row">
                <div class="col-auto">
                  <h3 class="text-uppercase ls-1 text-white py-3 mb-0">Consignado</h3>
                </div>
                <div class="col text-right">
                  <el-tooltip content="Ver Detalhes" placement="top">
                    <base-button class="icon icon-shape bg-white text-dark rounded-circle shadow" :disabled="emptyPayroll" @click="details_payroll = true">
                      <i class="fas fa-search-plus fa-lg"></i>
                    </base-button>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <img src="/img/svg/undraw_shopping_eii3.svg" alt="" :width="emptyPayroll ? '54%' : '60%'">
            <div class="mt-3" v-if="emptyPayroll">
              <span class="pl-2 text-sm text-white">Nenhum consignado foi feito!</span>
            </div>

            <div class="mt-3" v-else>
              <div class="display-2 text-white">{{visit.payrolls.price + visit.payroll_sales.price | currency}}</div>
              <span class=" text-white">Valor Total Do Consignado</span>
            </div>

            <!--Footer-->
            <base-button slot="footer" type="primary" v-if="emptyPayroll" @click="CHANGE_COMPONENT('create-payroll')">Criar Consignado</base-button>
            <div class="row" slot="footer" v-else>
              <div class="col">
                <base-button type="warning" @click="CHANGE_COMPONENT('edit-payroll')">Editar Consignado</base-button>
              </div>
              <div class="col">
                <base-button type="danger" @click="removePayroll">Apagar Consignado</base-button>
              </div>
            </div>
          </card>
        </div>
        <div class="col-lg-4">
          <card gradient="warning" header-classes="bg-transparent" footer-classes="bg-transparent" body-classes="px-lg-7" class="card-pricing border-0 text-center mb-4">

            <div slot="header">
              <div class="row">
                <div class="col-auto">
                  <h3 class="text-uppercase ls-1 text-white py-3 mb-0">Devolução</h3>
                </div>
                <div class="col text-right">
                  <el-tooltip content="Ver Detalhes" placement="top">
                    <base-button class="icon icon-shape bg-white text-dark rounded-circle shadow" disabled>
                      <i class="fas fa-search-plus fa-lg"></i>
                    </base-button>
                  </el-tooltip>
                </div>
              </div>
            </div>

            <img src="/img/svg/undraw_empty_xct9.svg" alt="" :width="true ? '54%' : '60%'">
            <div class="mt-3" v-if="true">
              <span class="pl-2 text-sm text-white">Nenhum consignado foi feito!</span>
            </div>

            <div class="mt-3" v-else>
              <div class="display-2 text-white">49</div>
              <span class=" text-white">Produtos</span>
              <ul class="list-unstyled my-4">
                <li>
                  <div class="d-flex align-items-center">
                    <div>
                      <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                        <i class="fas fa-hand-holding-usd"></i>
                      </div>
                    </div>
                    <div>
                      <span class="pl-2 text-sm text-white">Valor Total: </span>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="d-flex align-items-center">
                    <div>
                      <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                        <i class="fas fa-hand-holding-usd"></i>
                      </div>
                    </div>
                    <div>
                      <span class="pl-2 text-sm text-white">Valor Total: </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <!--Footer-->
            <base-button slot="footer" type="primary" disabled>Criar Devolução</base-button>
          </card>
        </div>
      </div>
    </div>

    <modal :show.sync="edit_info" size="lg">
      <template slot="header">
        <h6 slot="header" class="modal-title" id="modal-title-default">Editar Visita</h6>
      </template>


      <div class="row">
        <div class="col-4">
          <base-input label="Cliente" :error="getError('customer')" :valid="isValid('customer')">
            <el-select v-model="visit.customer" filterable placeholder="Selecione o cliente." name="customer"
                       v-validate="'required'" :class="[{'is-invalid': getError('customer')}]">
              <el-option v-for="item in customers" :key="item.id" :label="item.company_name" :value="item.id"/>
            </el-select>
          </base-input>
        </div>
        <div class="col-4">
          <base-input label="Vendedor" :error="getError('seller')" :valid="isValid('seller')">
            <el-select v-model="visit.seller" filterable placeholder="Selecione o vendedor." name="seller" v-validate="'required'" :class="[{'is-invalid': getError('seller')}]">
              <el-option v-for="item in sellers" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </base-input>
        </div>
        <div class="col-4">
          <mask-input name="date" placeholder="##/##/####" label="Data da Visita" v-model="visit.date" :key="visit.id"
                      :mask="'##/##/####'" :masked="true" validate="required|date_format:dd/MM/yyyy|before_today"/>
        </div>
        <div class="col-12">
          <label class="form-control-label">Anotações</label>
          <html-editor v-model="visit.annotations" name="annotations"></html-editor>
        </div>
      </div>

      <template slot="footer">
        <base-button type="primary" @click="submitForm">Salvar</base-button>
        <base-button type="link" class="ml-auto" @click="edit_info = false">Fechar
        </base-button>
      </template>
    </modal>
    <modal :show.sync="details_sale" size="lg" v-if="visit.sales">
      <template slot="header">
        <h6 slot="header" class="modal-title">Detalhes do Pedido</h6>
      </template>

      <div class="card-body">
          <ul class="list-group list-group-flush list my--3" >
              <li class="list-group-item px-0" v-for="product in visit.sales" :key="product.reference">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <div class="avatar rounded-circle">
                      <img :src="product.thumbnail" alt="Image product" width="35%">
                    </div>
                  </div>
                  <div class="col">
                    <small>Referência:</small>
                    <h5 class="mb-0">{{product.reference}}</h5>
                  </div>
                  <div class="col">
                    <small>Cor:</small>
                    <h5 class="mb-0">{{product.color}}</h5>
                  </div>
                  <div class="col">
                    <small>Tamanho:</small>
                    <h5 class="mb-0">{{product.size}}</h5>
                  </div>
                  <div class="col">
                    <small>Quantidade:</small>
                    <h5 class="mb-0">{{product.amount}}</h5>
                  </div>
                  <div class="col">
                    <small>Preço:</small>
                    <h5 class="mb-0">{{product.price | currency}}</h5>
                  </div>
                  <div class="col">
                    <small>Total:</small>
                    <h5 class="mb-0">{{(product.price * product.amount) | currency}}</h5>
                  </div>
                </div>
              </li>
            </ul>
        </div>

      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="details_sale = false">Fechar</base-button>
      </template>
    </modal>
    <modal :show.sync="details_payroll" size="lg" v-if="visit.payrolls || visit.payrolls_sales">
      <template slot="header">
        <h6 slot="header" class="modal-title">Detalhes do Consignado</h6>
      </template>


      <div class="card-body">
        <ul class="list-group list-group-flush list my--3" >
          <li class="list-group-item px-0" v-for="product in visit.payrolls" :key="product.reference">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="avatar rounded-circle">
                  <img :src="product.thumbnail" alt="Image product" width="35%">
                </div>
              </div>
              <div class="col">
                <small>Referência:</small>
                <h5 class="mb-0">{{product.reference}}</h5>
              </div>
              <div class="col">
                <small>Cor:</small>
                <h5 class="mb-0">{{product.color}}</h5>
              </div>
              <div class="col">
                <small>Tamanho:</small>
                <h5 class="mb-0">{{product.size}}</h5>
              </div>
              <div class="col">
                <small>Quantidade:</small>
                <h5 class="mb-0">{{product.amount}}</h5>
              </div>
              <div class="col">
                <small>Preço:</small>
                <h5 class="mb-0">{{product.price | currency}}</h5>
              </div>
              <div class="col">
                <small>Total:</small>
                <h5 class="mb-0">{{(product.price * product.amount) | currency}}</h5>
              </div>
            </div>
          </li>
          <li class="list-group-item px-0" v-for="sale in visit.payrolls_sales" :key="sale.reference">
            <div class="row align-items-center">
              <div class="col-auto">
                <div class="avatar rounded-circle">
                  <img :src="sale.thumbnail" alt="Image product" width="35%">
                </div>
              </div>
              <div class="col">
                <small>Referência:</small>
                <h5 class="mb-0">{{sale.reference}}</h5>
              </div>
              <div class="col">
                <small>Cor:</small>
                <h5 class="mb-0">{{sale.color}}</h5>
              </div>
              <div class="col">
                <small>Tamanho:</small>
                <h5 class="mb-0">{{sale.size}}</h5>
              </div>
              <div class="col">
                <small>Quantidade:</small>
                <h5 class="mb-0">{{sale.amount}}</h5>
              </div>
              <div class="col">
                <small>Preço:</small>
                <h5 class="mb-0">{{sale.price | currency}}</h5>
              </div>
              <div class="col">
                <small>Total:</small>
                <h5 class="mb-0">{{(sale.price * sale.amount) | currency}}</h5>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="details_payroll = false">Fechar
        </base-button>
      </template>
    </modal>
  </div>
</template>

<style>
  .card-sale {
    background: url('/img/svg/undraw_empty_cart_co35.svg') no-repeat right, linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
    background-size: 20%, 100% !important;
  }
  .card-payroll {
    background: url('/img/svg/undraw_shopping_eii3.svg') no-repeat right, linear-gradient(87deg, #5e72e4 0, #825ee4 100%) !important;
    background-size: 25%, 100% !important;
  }
  .card-devolution {
    background: url('/img/svg/undraw_empty_xct9.svg') no-repeat right, linear-gradient(87deg, #fb6340 0, #fbb140 100%) !important;
    background-size: 23%, 100% !important;
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

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {EDIT, GET, DELETE_PAYROLL, DELETE_SALE, CHANGE_COMPONENT} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import {Select, Option, Tooltip} from 'element-ui';
  import {isEmpty} from 'lodash';
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
      [Tooltip.name]: Tooltip,
      CreateSale,
      EditSale,
      CreatePayroll,
      EditPayroll,
    },
    data () {
      return {
        edit_info: false,
        details_sale: false,
        details_payroll: false,
        customers: [],
        sellers: []
      }
    },
    computed: {
      ...mapState('visit', {
        loading: state => state.loading,
        visit: state => state.visit,
        component: state => state.component,
      }),
      emptySale() {
        return isEmpty(this.visit.sales)
      },
      emptyPayroll() {
        return isEmpty(this.visit.payrolls) || isEmpty(this.visit.payroll_sale)
      }
    },
    async created() {
      await this.GET(this.id);
      await http.get('customers').then(response => this.customers = response.data).catch(error => console.dir(error));
      await http.get('employees', {search: 'seller'}).then(response => this.sellers = response.data).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('visit', [GET, EDIT, DELETE_PAYROLL, DELETE_SALE]),
      ...mapMutations('visit', [CHANGE_COMPONENT]),
      removeSale() {
        this.DELETE_SALE(this.visit.id).then(res => notifyVue(this.$notify, 'Pedido apagado!', 'success')).catch(error => notifyError(this.$notify, error));
      },
      removePayroll() {
        this.DELETE_PAYROLL(this.visit.id).then(res => notifyVue(this.$notify, 'Consignado apagado!', 'success')).catch(error => notifyError(this.$notify, error));
      },
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
