<template>
  <div class="row">
    <div class="col-12">
      <cart :products="visit.sales" :packing="packing" :validated="validated" :sum-products="sumProductsValue"/>
    </div>
    <div class="col-12">
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
          </div>
          <div class="my-4">
            <span class="h4">
              Valor Final
            </span>
            <div class="h2">{{sumProductsValue | currency}}</div>
          </div>

          <base-button type="secondary" size="sm" @click="CHANGE_COMPONENT()">Voltar</base-button>
          <base-button type="primary" size="sm" @click="submitForm">Atualizar Pedido</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cart from './Partials/Cart'

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {EDIT_SALE, CHANGE_COMPONENT} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'edit',
    $_veeValidate: {
      validator: 'new'
    },
    components: {
      Cart
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
        visit: state => state.visit,
        component: state => state.component
      }),
      sumProductsValue(){
        return sumBy(this.visit.sales, function (o) {
          return (o.price * o.amount)
        })
      },
      sumProducts() {
        return sumBy(this.visit.sales, 'amount')
      }
    },
    methods: {
      ...mapActions('visit', [EDIT_SALE]),
      ...mapMutations('visit', [CHANGE_COMPONENT]),
      sendPayment() {
        if (isEmpty(this.visit.sales)) {
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
                this.EDIT_SALE({visit_id: this.visit.id, data: this.visit.sales})
                  .then(response => {
                    notifyVue(this.$notify, 'Pedido editado com sucesso', 'success');
                    this.CHANGE_COMPONENT()
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
