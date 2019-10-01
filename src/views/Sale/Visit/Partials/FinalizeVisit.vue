<template>
  <div class="container-fluid mt--6" v-else>
    <div class="row">
      <div class="col-lg-4">
        <stats-card class="bg-gradient-info">
          <!-- Card body -->
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Valor Total</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{(visit.sale.price + visit.payroll_sale.price) | currency}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                <i class="ni ni-money-coins"></i>
              </div>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-white mr-2">{{visit.sale.price | currency}}</span>
            <span class="text-nowrap text-white">Valor do pedido</span>
          </p>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-white mr-2">{{visit.payroll_sale.price | currency}}</span>
            <span class="text-nowrap text-white">Valor recebido do consignado</span>
          </p>

        </stats-card>
      </div>
      <div class="col-lg-4">
        <stats-card class="bg-gradient-warning">
          <!-- Card body -->
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Descontos Totais</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{(visit.discount + visit.refund.price) | currency}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                <i class="fas fa-hand-holding-usd"></i>
              </div>
            </div>
          </div>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-white mr-2">{{visit.refund.price | currency}}</span>
            <span class="text-nowrap text-white">Valor de devolução</span>
          </p>
          <p class="mt-3 mb-0 text-sm">
            <span class="text-white mr-2">{{visit.discount | currency}}</span>
            <span class="text-nowrap text-white">Valor de desconto aplicado</span>
          </p>

        </stats-card>
      </div>
      <div class="col-lg-4">
        <stats-card class="bg-gradient-primary">
          <!-- Card body -->
          <div class="row">
            <div class="col">
              <h5 class="card-title text-uppercase text-muted mb-0 text-white">Valor Final</h5>
              <span class="h2 font-weight-bold mb-0 text-white">{{(visit.total_price - visit.discount) | currency}}</span>
            </div>
            <div class="col-auto">
              <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
            </div>
          </div>
          <p class="mt-3 text-sm">
            <span class="text-white mr-2"><i class="fa fa-arrow-up text-success"></i> {{(visit.sale.price + visit.payroll_sale.price) | currency}}</span>
            <span class="text-nowrap text-white">Valor Total</span>
          </p>
          <p class="mt-3 text-sm mb-0">
            <span class="text-white mr-2"><i class="fa fa-arrow-down text-danger mr-1"></i>{{(visit.discount + visit.refund.price) | currency}}</span>
            <span class="text-nowrap text-white">Valor de Desconto</span>
          </p>
        </stats-card>
      </div>
      <div class="col-12">
        <card>
          <h3 slot="header" class="mb-0">Informações adicionais</h3>
          <div class="row">
            <div class="col-lg-2">
              <div class="form-group">
                <label class="form-control-label">
                  Aplicar Desconto
                </label>
                <div class="input-group has-label">
                  <money class="form-control" v-model="discount" name="discount"
                         v-bind="type_discount_money ? money : percentage"/>

                  <div class="input-group-append">
                    <el-tooltip content="Mudar Tipo" placement="top">
                      <base-button type="primary" size="lg" @click="changeTypeDiscount">
                        <i :class="type_discount_money ? 'fas fa-dollar-sign fa-lg' : 'fas fa-percentage fa-lg'"></i>
                      </base-button>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <card>
                <h3 slot="header" class="mb-0">Adicionar formas de Pagamento</h3>

                <div class="form-row">
                  <div class="col-lg-3">
                    <base-input label="Tipo" :error="getError('method')" :valid="isValid('method')">
                      <select name="method" class="form-control" v-model="payment_method" :class="[{'is-invalid': getError('method')}]" v-validate="'required'">
                        <option value="" selected>Selecione a forma de pagamento.</option>
                        <option value="money">Dinheiro</option>
                        <option value="check">Cheque</option>
                        <option value="boleto">Boleto</option>
                        <option value="credit_card">Cartão</option>
                      </select>
                    </base-input>
                  </div>
                  <div class="col-lg-3" v-if="payment_method === 'money'">
                    <money-input label="Valor" v-model="value_method" name="value" :error="getError('value')" :valid="isValid('value')" v-validate="'required|min_value:1'"/>
                  </div>
                  <div class="col-lg-9" v-if="payment_method === 'check' || payment_method === 'boleto' || payment_method === 'credit_card'">
                    <div class="form-row">
                      <div class="col-lg-6">
                        <base-input type="number" name="amount" label="Número de Parcelas" v-model="installments_method" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required|min_value:1'"/>
                      </div>
                      <div class="col-lg-6" v-if="(payment_method === 'check' && installments_method <= 1) || payment_method === 'boleto' || payment_method === 'credit_card'">
                        <money-input label="Valor Total" v-model="value_method" name="value" :error="getError('value')" :valid="isValid('value')" v-validate="'required|min_value:1'"/>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12" v-if="payment_method === 'check'">
                    <div class="form-row" v-for="(item, key) in data_check" :key="item">
                      <h5 class="col-12 heading mb-4">Parcela {{++key}}</h5>
                      <div class="col">
                        <base-input name="name_check" label="Nome do Titular" v-model="item.name_check" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
                      </div>
                      <div class="col">
                        <base-input name="number_check" label="Nº do Cheque" v-model="item.number_check" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
                      </div>
                      <div class="col">
                        <mask-input name="date_check" placeholder="##/##/####" label="Bom Para" v-model="item.date_check" :key="date_method"
                                    :mask="'##/##/####'" :masked="true" validate="required|date_format:dd/MM/yyyy"/>
                      </div>
                      <div class="col">
                        <base-input name="bank_check" label="Banco" v-model="item.bank_check" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
                      </div>
                      <div class="col" v-if="installments_method > 1">
                        <money-input label="Valor Total" v-model="item.value_check" :key="key" name="value" :error="getError('value')" :valid="isValid('value')" v-validate="'required|min_value:1'"/>
                      </div>
                    </div>
                  </div>
                </div>

                <base-button slot="footer" type="primary" size="sm" @click="addPaymentMethod">
                  Adicionar
                </base-button>
              </card>
            </div>
            <div class="col-lg-3 card bg-gradient-primary mr-1 mb-0" v-if="!emptyPaychecks">
              <!-- Card body -->
              <div class="card-body">
                <div class="row justify-content-between align-items-center">
                  <div class="col">
                    <i class="fas fa-money-check-alt fa-2x text-white">
                      <span class="ml-1 h3 text-white mb-1 text-card">{{translateMethod('check')}} </span>
                    </i>
                  </div>
                  <div class="col-auto">
                    <base-button size="sm" type="danger" @click="removePaymentMethod('check')">Remover</base-button>
                  </div>
                </div>
                <div class="my-4">
                  <span class="h6 surtitle text-light">
                    Valor Total
                  </span>
                  <div class="card-serial-number h1 text-white">
                    <div>
                      {{sumValueCheck | currency}}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <span class="h6 surtitle text-light">Número de Parcelas</span>
                    <span class="d-block h3 text-white">{{data_methods.paychecks.length}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 card bg-gradient-primary mr-1 mb-0" v-for="(method, key) in data_methods.payment_methods" :key="key">
              <!-- Card body -->
              <div class="card-body">
                <div class="row justify-content-between align-items-center">
                  <div class="col">
                    <i class="fas fa-file-invoice-dollar fa-2x text-white" v-if="method.method === 'boleto'">
                      <span class="ml-1 h3 text-white mb-1 text-card">{{translateMethod(method.method)}} </span>
                    </i>
                    <i class="far fa-credit-card fa-2x text-white" v-if="method.method === 'credit_card'">
                      <span class="ml-1 h3 text-white mb-1 text-card">{{translateMethod(method.method)}} </span>
                    </i>
                    <i class="fas fa-money-bill fa-2x text-white" v-if="method.method === 'money'">
                      <span class="ml-1 h3 text-white mb-1 text-card">{{translateMethod(method.method)}} </span>
                    </i>
                  </div>
                  <div class="col-auto">
                    <base-button size="sm" type="danger" @click="removePaymentMethod(key)">Remover</base-button>
                  </div>
                </div>
                <div class="my-4">
                  <span class="h6 surtitle text-light">
                    Valor Total
                  </span>
                  <div class="card-serial-number h1 text-white">
                    <div>
                      {{method.value | currency}}
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <span class="h6 surtitle text-light">Número de Parcelas</span>
                    <span class="d-block h3 text-white">{{method.instalments}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template slot="footer">
            <base-button type="primary" @click="submitForm">Salvar</base-button>
            <base-button type="link" class="ml-auto" @click="$emit('close')">Cancelar</base-button>
          </template>
        </card>
      </div>
    </div>
  </div>
</template>

<style>
  .text-card {
    position: absolute;
    margin: 0;
    top: 50%;
    transform: translate(0px, -50%);
  }
</style>

<script>
  import MaskInput from '@/components/App/Inputs/Mask';
  import MoneyInput from '@/components/App/Inputs/Money';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState} from 'vuex';
  import {Money} from 'v-money'
  import {FINALIZE} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import {Select, Option, Tooltip} from 'element-ui';
  import {isEmpty, sumBy} from 'lodash';
  import {http} from "@/services";

  export default {
    name: 'finalize-visit',
    mixins: [crudSettingsMixin],
    components: {
      Money,
      MoneyInput,
      MaskInput,
      [Select.name]: Select,
      [Option.name]: Option,
      [Tooltip.name]: Tooltip
    },
    data() {
      return {
        payment_method: '',
        value_method: 0,
        installments_method: 1,
        data_check: [
          {
            name_check: '',
            date_check: '',
            number_check: '',
            bank_check: '',
            value_check: 0
          }
        ],
        data_methods: {
          payment_methods: [],
          paychecks: []
        },
        type_discount_money: true,
        discount: 0,
        money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: '',
          precision: 2,
          masked: false
        },
        percentage: {
          decimal: '',
          thousands: '',
          prefix: '',
          suffix: ' %',
          precision: 0,
          masked: false
        }
      }
    },
    watch: {
      discount(value) {
        if (this.type_discount_money) {
          this.visit.discount = value;
        } else {
          this.visit.discount = (this.visit.total_price * value) / 100;
        }
      },
      installments_method(value) {
        const arr = [];

        for (let i = 0; i < value; i++) {
          arr.push(
            {
              name_check: '',
              date_check: '',
              number_check: '',
              bank_check: '',
              value_check: 0
            }
          )
        }

        this.data_check = arr
      }
    },
    computed: {
      ...mapState('visit', {
        visit: state => state.visit
      }),
      emptyPaychecks() {
        return isEmpty(this.data_methods.paychecks)
      },
      sumValueCheck() {
        return sumBy(this.data_methods.paychecks, 'value')
      },
      sumValueMethods() {
        return sumBy(this.data_methods.payment_methods, 'value') + this.sumValueCheck
      }
    },
    async created() {
      this.data_methods.payment_methods = this.visit.payment_methods || [];
    },
    methods: {
      ...mapActions('visit', [FINALIZE]),
      translateMethod(method) {
        const methods = {
          money: 'Dinheiro',
          boleto: 'Boleto',
          credit_card: 'Cartão',
          check: 'Cheque'
        };

        return methods[method]
      },
      changeTypeDiscount() {
        this.type_discount_money = !this.type_discount_money
      },
      addPaymentMethod() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                if (this.payment_method === 'check') {
                  for (const check of this.data_check) {

                    this.data_methods.paychecks.push({
                      holder   : check.name_check,
                      bank     : check.bank_check,
                      number   : check.number_check,
                      pay_date : check.date_check,
                      value    :  this.data_check.length > 1 ? check.value_check : this.value_method
                    })
                  }
                } else {
                  this.data_methods.payment_methods.push({
                    method: this.payment_method,
                    installments: this.installments_method,
                    value: this.value_method
                  });
                }

                this.payment_method = '';
                this.value_method = 0;
                this.installments_method = 1;
                this.data_check = [
                  {
                    name_check: '',
                    date_check: '',
                    number_check: '',
                    bank_check: '',
                    value_check: 0
                  }
                ]
              }
            }
          ).catch(e => console.log(e))
        } finally {
          this.validated = true;
        }
      },
      removePaymentMethod(key) {
        if (key === 'check') {
          this.data_methods.paychecks = []
        } else {
          this.data_methods.payment_methods.splice(key, 1)
        }
      },
      async submitForm() {
        const finishValue = this.visit.total_price - this.visit.discount;

        if (this.sumValueMethods !== finishValue) {
          notifyVue(this.$notify, 'Os Valores dos métodos de pagamento somados não batem com o Valor final!', 'danger');
          return;
        }

        this.FINALIZE({visit_id: this.visit.id, data: {
            discount: this.discount,
            payment_methods: this.data_methods.payment_methods,
            paychecks: this.data_methods.paychecks
        }}).then(res => {
          notifyVue(this.$notify, 'Visita finalizada com sucesso', 'success');
          this.$router.push('sale.visit.index')
        }).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
