<template>
  <div class="row">
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Produtos Do Romaneio</h3>
        </div>

        <div class="d-flex">
          <div class="form-group">
            <div class="input-group has-label">
              <div class="input-group-prepend">
            <span class="input-group-text">
              <slot name="prepend">
                <i class="fas fa-search"></i>
              </slot>
            </span>
              </div>
              <input type="text" class="form-control" placeholder="Buscar produto..." v-model.lazy="searchQuery">
            </div>
          </div>
        </div>

        <el-table :data="queriedData" header-row-class-name="thead-light" @sort-change="sortChange" v-if="packing.products">
          <el-table-column prop="reference" label="Referência"/>
          <el-table-column prop="color" label="Cor" sortable/>
          <el-table-column prop="size" label="Tamanho" sortable/>
          <el-table-column label="Preço" sortable>
            <template v-slot="{row}">
              {{row.price | currency}}
            </template>
          </el-table-column>
          <el-table-column label="Estoque" sortable>
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
      </card>
    </div>
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Pedido</h3>
        </div>

        <form class="needs-validation">
          <div class="card-body">
            <div class="text-center" v-show="emptySale">
              <img src="/img/svg/undraw_empty_cart_co35.svg" alt="Empty sale" width="20%">

              <h4 class="mt-5">Nada foi adicionado ao carrinho!</h4>
            </div>
            <div v-show="!emptySale">
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
                      <small>Preço:</small>
                      <h5 class="mb-0">{{product.price | currency}}</h5>
                    </div>
                    <div class="col">
                      <small>Total:</small>
                      <h5 class="mb-0">{{(product.price * product.amount) | currency}}</h5>
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
  </div>
</template>

<script>
  import Fuse from 'fuse.js';
  import {Money} from 'v-money'
  import clientPaginationMixin from '@/mixins/client-pagination';

  import {notifyVue} from "@/utils";
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'
  import {isEmpty} from 'lodash'

  export default {
    name: 'cart-sale',
    mixins: [clientPaginationMixin],
    props: {
      products: {
        type: Object,
        required: true
      },
      packing: {
        type: Object,
        required: true
      },
      sumProducts: {
        type: Number,
        required: true
      }
    },
    components: {
      Money,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        fuseSearch: null
      }
    },
    watch: {
      packing(value) {
        this.fuseSearch = new Fuse(value.products, {keys: ['reference', 'color', 'size'], threshold: 0.3})
      }
    },
    computed: {
      emptySale() {
        return isEmpty(this.products)
      },
      tableData() {
        return this.packing.products
      }
    },
    methods: {
      searchApi(value) {
        return this.fuseSearch.search(value);
      },
      addProduct(data) {
        if (data.amount) {
          const productItem = this.products.find(item => item.reference === data.reference);

          if (productItem) {
            productItem.amount++
          } else {
            let productNew = {
              reference: data.reference,
              amount: 1,
              color: data.color,
              size: data.size,
              price: data.price,
              thumbnail: data.thumbnail
            };

            this.products.push(productNew);
          }

          data.amount--;
        } else {
          notifyVue(this.$notify, 'Item esgotado!', 'danger', 'ni ni-fat-remove');
        }
      },
      removeOne(data) {
        const productItem = this.packing.products.find(item => item.reference === data.reference);

        if (data.amount > 1) {
          data.amount--
        } else {
          this.products.splice(this.products.indexOf(data), 1);
        }

        if (productItem) productItem.amount++
      },
      removeAll(data) {
        const productItem = this.packing.products.find(item => item.reference === data.reference);
        if (productItem) productItem.amount += data.amount;

        this.products.splice(this.products.indexOf(data), 1);
      }
    }
  };
</script>
