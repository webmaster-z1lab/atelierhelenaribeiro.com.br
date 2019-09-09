<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="!subIndex">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Lista de Produtos</h3>
              <p class="text-sm mb-0">
                Lista de todos os produtos cadastrados no sistema agrupados por modelo para facilitar buscas.
              </p>
            </div>
            <div class="col-6 text-right">
              <el-tooltip content="Criar Novo Funcionário" placement="top">
                <router-link :to="{name: 'stock.product.create'}" class="btn btn-icon btn-fab btn-sm btn-primary">
                  <span class="btn-inner&#45;&#45;icon"><i class="fas fa-plus"></i></span>
                  <span class="btn-inner--text">Add</span>
                </router-link>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <el-select class="select-primary pagination-select" v-model="pagination.perPage" placeholder="Por página">
              <el-option class="select-primary" v-for="item in pagination.perPageOptions" :key="item" :label="item" :value="item"/>
            </el-select>

            <div>
              <div class="form-group">
                <div class="input-group has-label">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <slot name="prepend">
                        <i class="fas fa-search"></i>
                      </slot>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="Buscar..." v-model.lazy="searchQuery">
                </div>
              </div>
            </div>
          </div>
          <el-table :data="queriedData" row-key="id" header-row-class-name="thead-light" @sort-change="sortChange">
            <el-table-column label="Referência" sortable>
              <template v-slot="{row}">
                {{row.reference}}
              </template>
            </el-table-column>
            <el-table-column prop="color" label="Cor" sortable/>
            <el-table-column prop="size" label="Tamanho" sortable/>
            <el-table-column prop="amount" label="Quant. Produtos" sortable/>

            <el-table-column min-width="60px" align="right" label="Ações">
              <div slot-scope="{$index, row}" class="d-flex">
                <el-tooltip content="Visualizar" placement="top">
                  <a href="javascript:;" class="table-action" data-toggle="tooltip" data-original-title="Show" @click="showSubIndex(row)">
                    <i class="fas fa-eye"></i>
                  </a>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="">
            <p class="card-category">
              Mostrando registros de {{ from + 1 }} a {{ to }} de {{ total }} entradas
            </p>

          </div>
          <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage" :total="total"/>
        </div>
      </card>
    </div>

    <SubIndex :data="subProducts" @close="closeSubIndex" v-else/>
  </div>
</template>

<style>
  .no-border-card .card-footer {
    border-top: 0;
  }
</style>

<script>
  import clientPaginationMixin from '@/mixins/client-pagination';

  import { BasePagination } from '@/components';
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';

  import {http} from "@/services";
  import SubIndex from './Index/SubIndex'
  import {mapActions, mapState, mapMutations} from 'vuex'
  import {GET_ALL, LOADING} from "@/store/modules/product/product-const";

  export default {
    name: 'index',
    mixins: [clientPaginationMixin],
    components: {
      SubIndex,
      BasePagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        subIndex: false,
        subProducts: []
      }
    },
    computed: {
      ...mapState('product', {
        tableData: state => state.products,
        products: state => state.products,
        loading: state => state.loading
      })
    },
    async created() {
      this.GET_ALL()
    },
    methods: {
      ...mapActions('product', [GET_ALL]),
      ...mapMutations('product', [LOADING]),
      showSubIndex(row) {
        this.subProducts = row;
        this.subIndex = !this.subIndex
      },
      closeSubIndex() {
        this.subIndex = !this.subIndex
      },
      async searchApi(value) {
        this.LOADING();

        await http.get('products', {search: value})
          .then(response => this.products = response.data)
          .catch(error => console.dir(error));

        this.LOADING();
        return this.products || []
      }
    }
  };
</script>
