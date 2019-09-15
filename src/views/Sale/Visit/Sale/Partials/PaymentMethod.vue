<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Pedido</h3>
        </div>

        <form class="needs-validation">
          <div class="card-body">
            <div>
              <ul class="list-group list-group-flush list my--3" >
                <li class="list-group-item px-0" v-for="product in sale.products" :key="product.reference">
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
          </div>
        </form>
      </card>
    </div>
    <div class="col-12">
      <card>
        <div class="row">
          <div class="col">
            <span class="d-block h3">Forma de Pagamento</span>
          </div>
          <div class="col text-right">
            <base-button type="primary" size="sm" @click="addPaymentMethod"><i class="fas fa-plus"></i> Adicionar</base-button>
          </div>
        </div>

        <div class="form-row" v-for="(method, key) in sale.payment_methods" :key="key">
          <div class="col-lg-6">
            <base-input label="Tipo" :error="getError(`method-${key}`)" :valid="isValid(`method-${key}`)">
              <select :name="`method-${key}`" class="form-control" v-model="method.method" :class="[{'is-invalid': getError(`method-${key}`)}]" v-validate="'required'">
                <option value="" selected>Selecione a forma de pagamento.</option>
                <option value="money">Dinheiro</option>
                <option value="check">Cheque</option>
                <option value="credit_card">Cartão</option>
              </select>
            </base-input>
          </div>
          <div class="col-lg-5" v-if="sale.payment_methods.length > 1">
            <money-input label="Valor" v-model="method.value" :name="`value-${key}`" :error="getError(`value-${key}`)" :valid="isValid(`value-${key}`)" v-validate="'required|min_value:1'"/>
          </div>
          <div class="col-lg-1 align-self-center text-right" v-if="key > 0">
            <base-button type="danger" class="btn-block" @click="removePaymentMethod(key)"><i class="fas fa-times fa-lg"></i></base-button>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import MoneyInput from '@/components/App/Inputs/Money';

  export default {
    name: 'payment-method-sale',
    inject: ['$validator'],
    props: {
      sale: {
        type: Object,
        required: true
      },
      validated: {
        type: Boolean,
        required: true
      }
    },
    components: {
      MoneyInput
    },
    methods: {
      addPaymentMethod() {
        this.sale.payment_methods.push({
          method: '',
          value: ''
        })
      },
      removePaymentMethod(key) {
        this.sale.payment_methods.splice(key, 1)
      },
      getError(name) {
        return this.errors.first(name)
      },
      isValid(name) {
        return this.validated && !this.errors.has(name);
      }
    }
  };
</script>
