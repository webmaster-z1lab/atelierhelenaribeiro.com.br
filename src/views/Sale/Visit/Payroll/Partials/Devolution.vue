<template>
  <div class="row justify-content-end">
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Romaneio</h3>
        </div>

        <el-table :data="queriedData" header-row-class-name="thead-light" @sort-change="sortChange">
          <el-table-column prop="reference" label="Referência" sortable/>
          <el-table-column prop="color" label="Cor" sortable/>
          <el-table-column prop="size" label="Tamanho" sortable/>
          <el-table-column label="Preço" sortable>
            <template v-slot="{row}">
              {{row.price | currency}}
            </template>
          </el-table-column>
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
      </card>
    </div>
    <div class="col-12">
      <card>
        <div slot="header">
          <h3 class="mb-0">Consignado</h3>
        </div>

        <form class="needs-validation">
          <div class="card-body">
            <div class="text-center" v-show="emptyRefund">
              <img src="/img/svg/undraw_empty_xct9.svg" alt="Empty sale" width="20%">

              <h4 class="mt-5">Nada foi adicionado para devolução!</h4>
            </div>
            <div v-show="!emptyRefund">
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
    <div class="col-4">
      <div class="card">
        <div class="card-body text-right">
          <div class="row justify-content-between align-items-center">
            <div class="col-auto">
              <span class="d-block h3">Resumo do Consignado</span>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <span class="h5 text-muted">Quant. Produtos</span>
              <span class="d-block h3">{{sumProducts}}</span>
            </div>
          </div>
          <div class="my-4">
            <span class="h4">
              Valor Total
            </span>
            <div class="h2">{{sumProductsValue | currency}}</div>
          </div>

          <base-button type="primary" native-type="submit" size="sm" class="btn-block" @click="submitForm">Finalizar</base-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import clientPaginationMixin from '@/mixins/client-pagination';

  import {mapActions, mapState} from 'vuex';
  import {EDIT_PAYROLL} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'devolution',
    mixins: [clientPaginationMixin],
    components: {
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        fuseSearch: null,
        available: [],
        products: []
      }
    },
    computed: {
      ...mapState('visit', {
        visit: state => state.visit
      }),
      sumProductsValue() {
        return sumBy(this.products, function (o) {
          return (o.price * o.amount)
        })
      },
      sumProducts() {
        return sumBy(this.products, 'amount')
      },
      emptyRefund() {
        return isEmpty(this.products)
      },
      tableData() {
        return this.available
      }
    },
    methods: {
      ...mapActions('visit', [EDIT_PAYROLL]),
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
        const productItem = this.available.find(item => item.reference === data.reference);

        if (data.amount > 1) {
          data.amount--
        } else {
          this.products.splice(this.products.indexOf(data), 1);
        }

        if (productItem) productItem.amount++
      },
      removeAll(data) {
        const productItem = this.available.find(item => item.reference === data.reference);
        if (productItem) productItem.amount += data.amount;

        this.products.splice(this.products.indexOf(data), 1);
      },
      async submitForm() {
        if (!isEmpty(this.products)) {
          this.EDIT_PAYROLL({visit_id: this.visit.id, ext: '/refunds', data: this.products})
            .then(response => {
              notifyVue(this.$notify, 'Devolução de consignado realizada com sucesso', 'success');
            })
            .catch(error => notifyError(this.$notify, error));
        } else {
          notifyVue(this.$notify, 'Adicione produtos antes de finalizar uma devolução de consignado!', 'danger');
        }
      }
    },
    async mounted() {
      await http.get(`visits/${this.visit.id}/payrolls/available`).then(response => this.available = response.data).catch(error => console.dir(error));
      this.products = this.visit.payroll_refunds
    }
  };
</script>
