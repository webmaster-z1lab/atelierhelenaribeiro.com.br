<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Paginated tables</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-breadcrumb/>
          </nav>
        </div>
      </div>
    </base-header>

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
                  <span class="btn-inner&#45;&#45;icon"><i class="fas fa-user-plus"></i></span>
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
            <el-table-column v-for="column in tableColumns" :key="column.label" v-bind="column"/>
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
  import {http} from "@/services";

  import clientPaginationMixin from '@/mixins/client-pagination'

  import SubIndex from './Index/SubIndex'
  import { BasePagination } from '@/components';
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';
  import {isEmpty} from 'lodash'

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
        products: [],
        subIndex: false,
        subProducts: [],
        tableColumns: [
          {
            prop: 'template',
            label: 'Modelo',
            minWidth: 220,
            sortable: true
          },
          {
            prop: 'color',
            label: 'Cor',
            minWidth: 150,
            sortable: true
          },
          {
            prop: 'size',
            label: 'Tamanho',
            minWidth: 150,
            sortable: true
          },
          {
            prop: 'amount',
            label: 'Quant. Produtos',
            minWidth: 220,
            sortable: true
          }
        ]
      }
    },
    computed: {
      tableData() {
        return this.products
      }
    },
    created() {
      http.get(process.env.VUE_APP_API_URL + '/products').then(res => this.products = res.data);
    },
    methods: {
      showSubIndex(row) {
        this.subProducts = row;
        this.subIndex = !this.subIndex
      },
      closeSubIndex() {
        this.subIndex = !this.subIndex
      },
      async searchApi(value) {
        this.changeLoading();

        await http.get(process.env.VUE_APP_API_URL + '/products', {search: value})
          .then(response => this.products = response.data)
          .catch(error => console.dir(error));

        this.changeLoading();

        return this.products || []
      }
    }
  };
</script>
