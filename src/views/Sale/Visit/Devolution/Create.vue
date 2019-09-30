<template>
  <div class="row justify-content-end">
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Dados do Produto</h3>
        </div>

        <div class="form-row">
          <div class="col-lg-4">
            <base-input label="Referência" :error="getError('reference')" :valid="isValid('reference')">
              <el-select v-model="template" filterable placeholder="Selecione o modelo do produto." name="reference" v-validate="'required'" :class="[{'is-invalid': getError('reference')}]" @change="setPriceBase">
                <el-option v-for="option in templates" :key="option.id" :label="option.reference" :value="option.reference"/>
              </el-select>
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input label="Cor" :error="getError('color')" :valid="isValid('color')">
              <el-select v-model="color" filterable default-first-option allow-create placeholder="Selecione a cor do produto." name="color" v-validate="'required'" :class="[{'is-invalid': getError('color')}]">
                <el-option v-for="color in colors" :key="color.id" :label="color.name" :value="color.reference"/>
              </el-select>
            </base-input>
          </div>
          <div class="col-lg-3">
            <base-input label="Tamanho" :error="getError('size')" :valid="isValid('size')">
              <select name="size" class="form-control" v-model="size" :class="[{'is-invalid': getError('size')}]" v-validate="'required'">
                <option value="" selected>Selecione o tamanho do produto.</option>
                <option :value="item.reference" :key="item.reference" v-for="item in sizes">{{item.name}}</option>
              </select>
            </base-input>
          </div>
          <div class="col-lg-2">
            <base-input type="number" name="amount" label="Quantidade" v-model="amount" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
          </div>
        </div>

        <div class="text-right">
          <base-button type="primary" native-type="submit" size="sm" @click="addProduct">Adicionar</base-button>
        </div>
      </card>
    </div>
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Lista de Devolução</h3>
        </div>

        <form class="needs-validation">
          <div class="card-body">
            <div class="text-center" v-show="emptyProducts">
              <img src="/img/svg/undraw_empty_cart_co35.svg" alt="Empty sale" width="15%">

              <h4 class="mt-5">Nada foi adicionado ao carrinho!</h4>
            </div>
            <div v-show="!emptyProducts">
              <ul class="list-group list-group-flush list my--3" >
                <li class="list-group-item px-0" v-for="product in products" :key="product.reference">
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
                      <small>Ações:</small>
                      <div class="mb-0">
                        <el-tooltip content="Remover Um" placement="top">
                          <a href="#!" @click.prevent="removeOne(product)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                            <i class="fas fa-trash"></i>
                          </a>
                        </el-tooltip>
                        <el-tooltip content="Deletar Tudo" placement="top" v-if="product.amount > 1">
                          <a href="#!" @click.prevent="removeAll(product)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                            <i class="fas fa-dumpster"></i>
                          </a>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </form>
      </card>
    </div>
    <div class="col-4">
      <div class="card">
        <div class="card-body text-right">
          <div class="row justify-content-between align-items-center">
            <div class="col-auto">
              <span class="d-block h3">Resumo da Devolução</span>
            </div>
          </div>

          <div class="my-4">
            <span class="h4">
              Quantidade de Produtos
            </span>
            <div class="h2">{{sumProducts}}</div>
          </div>

          <base-button type="primary" size="sm" @click="submitForm">Finalizar Devolução</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {CREATE_DEVOLUTION, CHANGE_COMPONENT} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui'
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'create',
    $_veeValidate: {
      validator: 'new'
    },
    mixins: [crudSettingsMixin],
    props: {
      visit: {
        type: Object,
        required: true
      }
    },
    components: {
      [Select.name]: Select,
      [Option.name]: Option,
    },
    data () {
      return {
        validated: false,
        template: '',
        size: '',
        color: '',
        amount: 1,
        products: [],
        templates: [],
        colors: [],
        sizes: []
      }
    },
    computed: {
      ...mapState('visit', {
        component: state => state.component
      }),
      emptyProducts() {
        return isEmpty(this.products)
      },
      sumProducts() {
        return sumBy(this.products, 'amount')
      }
    },
    methods: {
      ...mapActions('visit', [CREATE_DEVOLUTION]),
      ...mapMutations('visit', [CHANGE_COMPONENT]),
      addProduct() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.products.push({
                  reference: `${this.template}-${this.color}-${this.size}`,
                  amount: this.amount,
                  color: this.color,
                  size: this.size
                })
              }
            }
          )
        } finally {
          this.validated = true;
        }
      },
      removeOne(data) {
        if (data.amount > 1) {
          data.amount--
        } else {
          this.products.splice(this.products.indexOf(data), 1);
        }
      },
      removeAll(data) {
        this.products.splice(this.products.indexOf(data), 1);
      },
      async submitForm() {
        if (isEmpty(this.products)) {
          notifyVue(this.$notify, 'Adicione produtos!', 'danger');
          return;
        }

        this.CREATE_DEVOLUTION({visit_id: this.visit.id, data: this.products})
          .then(response => {
            notifyVue(this.$notify, 'Devolução criada com sucesso!', 'success');
            this.CHANGE_COMPONENT()
          })
          .catch(error => notifyError(this.$notify, error));
      }
    },
    async mounted() {
      await http.get('templates').then(res => {this.templates = res.data});
      await http.get('colors').then(res => {this.colors = res.data});
      await http.get('sizes').then(res => {this.sizes = res.data});
    }
  };
</script>
