<template>
  <div class="row">
    <div class="col-12">
      <cart :products="products" :packing="packing" :validated="validated" :sum-products="sumProductsValue"/>
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

          <base-button type="primary" size="sm" @click="submitForm">Finalizar Pedido</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Cart from './Partials/Cart'

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {CREATE_SALE, CHANGE_COMPONENT} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'create',
    $_veeValidate: {
      validator: 'new'
    },
    props: {
      visit: {
        type: Object,
        required: true
      }
    },
    components: {
      Cart
    },
    data () {
      return {
        packing: {},
        validated: false,
        products: []
      }
    },
    computed: {
      ...mapState('visit', {
        component: state => state.component
      }),
      sumProductsValue(){
        return sumBy(this.products, function (o) {
          return (o.price * o.amount)
        })
      },
      sumProducts() {
        return sumBy(this.products, 'amount')
      }
    },
    methods: {
      ...mapActions('visit', [CREATE_SALE]),
      ...mapMutations('visit', [CHANGE_COMPONENT]),
      async submitForm() {
        if (isEmpty(this.products)) {
          notifyVue(this.$notify, 'Adicione produtos!', 'danger');
          return;
        }
        this.CREATE_SALE({visit_id: this.visit.id, data: this.products})
          .then(response => {
            notifyVue(this.$notify, 'Pedido criado com sucesso', 'success');
            this.CHANGE_COMPONENT()
          })
          .catch(error => notifyError(this.$notify, error));
      }
    },
    async mounted() {
      await http.get('packings/current', {seller: this.visit.seller.id}).then(response => this.packing = response.data).catch(error => console.dir(error));
    }
  };
</script>
