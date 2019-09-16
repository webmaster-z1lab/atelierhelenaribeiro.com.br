<template>
  <card>
    <div class="container">
      <div class="row">
        <div class="col-6">
          <stats-card :class="component === 'cart' ? 'card-tab-cart-check' : 'card-tab-cart'">
            <div class="row">
              <div class="col">
                <span class="h2 font-weight-bold mb-0 text-white">Carrinho</span>
              </div>
            </div>
          </stats-card>
        </div>
        <div class="col-6">
          <stats-card :class="component === 'payment-method' ? 'card-tab-payment-check' : 'card-tab-payment'">
            <div class="row">
              <div class="col">
                <span class="h2 font-weight-bold mb-0 text-white">Pagamento</span>
              </div>
            </div>
          </stats-card>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-8">
        <component :is="component" :sale="sale" :packing="packing" :validated="validated" :sum-products="sumProductsValue"/>
      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-body text-right">
            <div class="row justify-content-between align-items-center">
              <div class="col-auto">
                <span class="d-block h3">Resumo do Pedido</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span class="h5 text-muted">Quant. Produtos</span>
                <span class="d-block h3">{{sumProducts}}</span>
              </div>
              <div class="col">
                <span class="h5 text-muted">Valor Total</span>
                <span class="d-block h3">{{sumProductsValue | currency}}</span>
              </div>
              <div class="col">
                <span class="h5 text-muted">Desconto Total</span>
                <span class="d-block h3">{{sale.discount | currency}}</span>
              </div>
            </div>
            <div class="my-4">
            <span class="h4">
              Valor Final
            </span>
              <div class="h2" :class="{'text-danger': (sumProductsValue - sale.discount) < 0}">{{(sumProductsValue - sale.discount) | currency}}</div>
            </div>

            <div class="row" v-if="component !== 'cart'">
              <div class="col-6">
                <base-button type="secondary" size="sm" class="btn-block" @click="component = 'cart'">Voltar</base-button>
              </div>
              <div class="col-6">
                <base-button type="primary" size="sm" class="btn-block" @click="submitForm">Atualizar Pedido</base-button>
              </div>
            </div>
            <base-button type="primary" size="sm" class="btn-block" @click="sendPayment" v-else>Pagamento</base-button>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
  import Cart from './Partials/Cart'
  import PaymentMethod from './Partials/PaymentMethod'

  import {mapActions, mapState} from 'vuex';
  import {EDIT_SALE} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'edit',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Cart,
      PaymentMethod
    },
    data () {
      return {
        component: 'cart',
        packing: {},
        validated: false
      }
    },
    computed: {
      ...mapState('visit', {
        sale: state => state.sale,
        visit: state => state.visit
      }),
      sumProductsValue(){
        return sumBy(this.sale.products, function (o) {
          return (o.price * o.amount)
        })
      },
      sumProducts() {
        return sumBy(this.sale.products, 'amount')
      }
    },
    methods: {
      ...mapActions('visit', [EDIT_SALE]),
      sendPayment() {
        if (isEmpty(this.sale.products)) {
          notifyVue(this.$notify, 'Adicione produtos antes de ir para área de pagamento!', 'warning');

          return;
        }

        this.component = 'payment-method'
      },
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                if (this.sale.payment_methods.length === 1) this.sale.payment_methods[0].value = (this.sumProductsValue - this.sale.discount);

                if (sumBy(this.sale.payment_methods, 'value') !== (this.sumProductsValue - this.sale.discount)) {
                  notifyVue(this.$notify, 'Os valores passados nas formas de pagamento não batem com o valor final!', 'danger', 'ni ni-fat-remove');
                  return;
                }

                this.EDIT_SALE(this.sale)
                  .then(response => {
                    notifyVue(this.$notify, 'Pedido editado com sucesso', 'success');
                    location.reload();
                  })
                  .catch(error => notifyError(this.$notify, error));
              }
            }
          )
        } finally {
          this.validated = true;
        }
      }
    },
    async created() {
      await http.get('packings/current', {seller: this.visit.seller.id}).then(response => {this.packing = response.data;}).catch(error => console.dir(error));
    },
  };
</script>
