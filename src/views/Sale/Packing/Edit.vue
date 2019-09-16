<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Editando Romaneio</h3>
          <p class="text-sm mb-0">
            Modifique os dados para atualizar as informações do romaneio.
          </p>
        </div>

        <h5 class="heading mb-4">Busca de Produtos</h5>
        <div class="col-4 justify-content-center justify-content-sm-between flex-wrap">
          <div class="form-group">
            <div class="input-group has-label">
              <input type="text" class="form-control" placeholder="Buscar..." v-model="query" @keyup.enter="searchQuery">
              <div class="input-group-append">
                <span class="input-group-text">
                  <slot name="prepend">
                    <i class="fas fa-search"></i>
                  </slot>
                </span>
              </div>
            </div>
          </div>
        </div>

        <el-table :data="products" header-row-class-name="thead-light" v-if="products.length">
          <el-table-column prop="reference" label="Referência" sortable/>
          <el-table-column prop="color" label="Cor" sortable/>
          <el-table-column prop="size" label="Tamanho" sortable/>
          <el-table-column label="Quant. em estoque" sortable>
            <template v-slot="{row}">
              <span v-if="row.amount">{{row.amount}}</span>
              <badge rounded type='danger' v-else>Esgotado</badge>
            </template>
          </el-table-column>

          <el-table-column min-width="60px" align="right" label="Ações">
            <div slot-scope="{$index, row}" class="d-flex">
              <el-tooltip content="Adicionar" placement="top">
                <a href="#!" @click.prevent="addProduct(row)" class="table-action" data-toggle="tooltip" data-original-title="Add">
                  <i class="fas fa-plus"></i>
                </a>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>

        <form class="needs-validation" @submit.prevent="submitForm">
          <hr class="mb-4 mt-0">
          <h5 class="heading mb-4">Lista de Produtos</h5>
          <el-table :data="packing.products" header-row-class-name="thead-light">
            <el-table-column prop="reference" label="Referência" sortable/>
            <el-table-column prop="color" label="Cor" sortable/>
            <el-table-column prop="size" label="Tamanho" sortable/>
            <el-table-column prop="amount" label="Quantidade" sortable/>

            <el-table-column min-width="60px" align="right" label="Ações">
              <div slot-scope="{$index, row}" class="d-flex">
                <el-tooltip content="Remover Um" placement="top">
                  <a href="#!" @click.prevent="removeOne(row)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                    <i class="fas fa-trash"></i>
                  </a>
                </el-tooltip>
                <el-tooltip content="Deletar Tudo" placement="top">
                  <a href="#!" @click.prevent="removeAll(row)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                    <i class="fas fa-dumpster"></i>
                  </a>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>

          <div class="form-row mt-4">
            <div class="col-lg-3">
              <base-input label="Vendedor" :error="getError('seller')" :valid="isValid('seller')">
                <el-select v-model="packing.seller_id" filterable placeholder="Selecione o representante do cliente." name="seller" v-validate="'required'" :class="[{'is-invalid': getError('seller')}]">
                  <el-option v-for="seller in sellers" :key="seller.id" :label="seller.name" :value="seller.id"/>
                </el-select>
              </base-input>
            </div>
          </div>
          <hr class="my-4">
          <base-button type="primary" native-type="submit">Enviar</base-button>
          <base-button type="secondary" @click="$router.back()">Voltar</base-button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState, mapMutations} from 'vuex';
  import {EDIT, GET, LOADING} from "@/store/modules/packing/packing-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'
  import {http} from "@/services";
  import {isEmpty} from 'lodash'

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
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        sellers: [],
        query: '',
        products: []
      }
    },
    computed: {
      ...mapState('packing', {
        loading: state => state.loading,
        packing: state => state.packing
      })
    },
    async created() {
      await this.GET(this.id);
      await http.get('employees', {search: 'seller'}).then(response => this.sellers = response.data).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('packing', [EDIT, GET]),
      ...mapMutations('packing', [LOADING]),
      async searchQuery() {
        if (this.query !== '') {
          this.products = [];
          this.LOADING();

          await http.get('products', {search: this.query}).then(res => {
            this.products = res.data
          }).catch(error => console.dir(error));

          this.LOADING();
        }
      },
      addProduct(data) {
        if (data.amount) {
          const productItem = this.packing.products.find(item => item.reference === data.reference);

          if (productItem) {
            productItem.amount++
          } else {
            let productNew = {
              reference: data.reference,
              amount: 1,
              color: data.products[0].color,
              size: data.products[0].size,
              price: data.products[0].price
            };

            this.packing.products.push(productNew);
          }

          data.amount--;
        } else {
          notifyVue(this.$notify, 'Item esgotado!', 'danger', 'ni ni-fat-remove');
        }
      },
      removeOne(data) {
        const productItem = this.products.find(item => item.reference === data.reference);

        if (data.amount > 1) {
          data.amount--
        } else {
          this.packing.products.splice(this.packing.products.indexOf(data), 1);
        }

        if (productItem) productItem.amount++
      },
      removeAll(data) {
        const productItem = this.products.find(item => item.reference === data.reference);
        if (productItem) productItem.amount += data.amount;

        this.packing.products.splice(this.packing.products.indexOf(data), 1);
      },
      async submitForm() {
        this.$validator.resume();
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.EDIT({
                  id: this.packing.id,
                  seller: this.packing.seller_id,
                  products: this.packing.products
                }).then(res => {
                  notifyVue(this.$notify, 'Romaneio editado com sucesso', 'success');
                  this.$router.push({name: 'sale.packing.index'})
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
