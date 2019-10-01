<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Baixa de Romaneio</h3>
          <p class="text-sm mb-0">
            Aqui você irá conferir os produtos e valores a serem recebidos ao final de cada viagem
          </p>
        </div>

        <div class="row">
          <div class="col-8">
            <div class="row">
              <div class="col-12">
                <card>
                  <div slot="header">
                    <h3 class="mb-0">Lista de Produtos</h3>
                  </div>

                  <div class="card-body">
                    <div>
                      <ul class="list-group list-group-flush list my--3" >
                        <li class="list-group-item px-0" v-for="(product, key) in packing.products" :key="product.reference" v-if="product.amount > 0">
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
                              <div class="form-group mb-0">
                                <input type="number" :name="`amount-${key}`" class="form-control input-list-checkout" :class="[{'is-valid': isValid(`amount-${key}`) === true}, {'is-invalid': getError(`amount-${key}`)}]"
                                       placeholder="Quant. de produtos" v-validate="`required|equal:${product.amount}`" @change="setQuantProduct($event.target.value, product)">
                                <div v-if="getError(`amount-${key}`)" class="invalid-feedback" style="display: block;">
                                  {{ getError(`amount-${key}`) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </card>
              </div>
              <div class="col-12">
                <card>
                  <div slot="header">
                    <h3 class="mb-0">Lista de Produtos</h3>
                  </div>

                  <div class="form-row">
                    <div class="col-lg-6">
                      <money-input label="Valor em Cheque" v-model="check" name="check" :error="getError('check')" :valid="isValid('check')" v-validate="'required'"/>
                    </div>
                    <div class="col-lg-6">
                      <money-input label="Valor em Dinheiro" v-model="money" name="money" :error="getError('money')" :valid="isValid('money')" v-validate="'required'"/>
                    </div>
                  </div>
                </card>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="card">
              <div class="card-body text-right">
                <div class="row justify-content-between align-items-center">
                  <div class="col-auto">
                    <span class="d-block h3">Resumo da Baixa</span>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <span class="h5 text-muted">Quant. Produtos</span>
                    <span class="d-block h3">{{sumProducts}}</span>
                  </div>
                  <div class="col">
                    <span class="h5 text-muted">Valor Dinheiro</span>
                    <span class="d-block h3">{{this.check_values.money | currency}}</span>
                  </div>
                  <div class="col">
                    <span class="h5 text-muted">Valor Cheque</span>
                    <span class="d-block h3">{{this.check_values.check | currency}}</span>
                  </div>
                </div>
                <div class="my-4">
                  <span class="h4">
                    Valor Total
                  </span>
                  <div class="h2">{{(this.check_values.check + this.check_values.money) | currency}}</div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <router-link :to="{name: 'sale.packing.index'}" class="btn btn-block btn-sm btn-secondary">Voltar</router-link>
                  </div>
                  <div class="col-6">
                    <base-button type="primary" size="sm" class="btn-block" @click="submitForm">Dar Baixa</base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<style>
  .input-list-checkout {
    height: calc(0.6em + 1.25rem + 5px);
  }
</style>

<script>
  import MoneyInput from '@/components/App/Inputs/Money';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {GET_PACKING_CURRENT, LOADING} from "@/store/modules/packing/packing-const";

  import {notifyVue, notifyError} from "@/utils";
  import {http} from "@/services";
  import {sumBy} from 'lodash'

  export default {
    name: 'checkout',
    $_veeValidate: {
      validator: 'new'
    },
    mixins: [crudSettingsMixin],
    components:{
      MoneyInput
    },
    props:{
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        check: 0,
        money: 0,
        check_products: [],
        check_values: {}
      }
    },
    computed: {
      ...mapState('packing', {
        loading: state => state.loading,
        packing: state => state.packing_current
      }),
      sumProducts() {
        return sumBy(this.packing.products, 'amount')
      }
    },
    methods: {
      ...mapActions('packing', [GET_PACKING_CURRENT]),
      ...mapMutations('packing', [LOADING]),
      setQuantProduct(value, product) {
        const productItem = this.check_products.find(item => item.reference === product.reference);

        if (productItem) {
          productItem.amount = value
        } else {
          let productNew = {
            reference: product.reference,
            amount: value
          };

          this.check_products.push(productNew);
        }
      },
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.LOADING();

                await http.post(`packings/${this.packing.id}`, {
                  checked: this.check_products,
                  money: this.money,
                  check: this.check
                }).then(async response => {
                  notifyVue(this.$notify, 'Baixa de romaneio realizada com sucesso', 'success');
                  this.LOADING();
                  await this.$router.push({name: 'sale.packing.index'});
                }).catch(error => {
                  notifyError(this.$notify, error);
                  this.LOADING();
                });
              }
            }
          )
        } finally {
          this.validated = true;
        }
      }
    },
    async created() {
      await this.GET_PACKING_CURRENT(this.id);
      await http.get(`packings/${this.packing.id}/receive`).then(response => this.check_values = response.data).catch(error => console.dir(error));
    },
  };
</script>
