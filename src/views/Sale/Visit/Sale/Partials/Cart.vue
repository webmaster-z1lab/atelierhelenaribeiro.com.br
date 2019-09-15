<template>
  <div class="row">
    <div class="col-12">
      <card>
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
          <h3 class="mb-0">Lista de Produtos</h3>
        </div>

        <form class="needs-validation">
          <div class="card-body">
            <div class="text-center" v-show="emptySale">
              <img src="/img/svg/undraw_empty_cart_co35.svg" alt="Empty sale" width="30%">

              <h4 class="mt-5">Nada foi adicionado ao carrinho!</h4>
            </div>
            <div v-show="!emptySale">
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

              <div class="form-row mt-5 mb--4">
                <div class="col-lg-3">
                  <div class="form-group">
                    <label class="form-control-label">
                      Aplicar Desconto
                    </label>
                    <div class="input-group has-label">
                      <money class="form-control" v-model="discount" name="discount" v-bind="type_discount_money ? money : percentage"/>

                      <div class="input-group-append">
                        <el-tooltip content="Mudar Tipo" placement="top">
                          <base-button type="primary" size="sm" @click="changeTypeDiscount">
                            <i :class="type_discount_money ? 'fas fa-dollar-sign fa-lg' : 'fas fa-percentage fa-lg'"></i>
                          </base-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      sale: {
        type: Object,
        required: true
      },
      packing: {
        type: Object,
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
        fuseSearch: null,
        type_discount_money: true,
        discount: '',
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
      packing(value) {
        this.fuseSearch = new Fuse(value.products, {keys: ['reference', 'color', 'size'], threshold: 0.3})
      },
      discount(value) {
        if (this.type_discount_money) {
          this.sale.discount = value;
        } else {
          this.sale.discount = (this.sumProductsValue * value) / 100;
        }
      }
    },
    computed: {
      emptySale() {
        return isEmpty(this.sale.products)
      },
      tableData() {
        return this.packing.products
      }
    },
    methods: {
      changeTypeDiscount() {
        this.type_discount_money = !this.type_discount_money
      },
      searchApi(value) {
        return this.fuseSearch.search(value);
      },
      addProduct(data) {
        if (data.amount) {
          const productItem = this.sale.products.find(item => item.reference === data.reference);

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

            this.sale.products.push(productNew);
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
          this.sale.products.splice(this.sale.products.indexOf(data), 1);
        }

        if (productItem) productItem.amount++
      },
      removeAll(data) {
        const productItem = this.packing.products.find(item => item.reference === data.reference);
        if (productItem) productItem.amount += data.amount;

        this.sale.products.splice(this.sale.products.indexOf(data), 1);
      }
    }
  };
</script>
