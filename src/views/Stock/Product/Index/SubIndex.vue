<template>
  <div class="container-fluid mt--6">
    <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
      <div slot="header">
        <div class="row">
          <div class="col-6">
            <h3 class="mb-0">Lista de Produtos</h3>
            <p class="text-sm mb-0">
              Lista de todos os produtos a partir do modelo selecionado e ordenados por tamanho e cor.
            </p>
          </div>
          <div class="col-6 text-right">
            <base-button type="secondary" @click="$emit('close')" size="sm">
              <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
              Voltar
            </base-button>
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
          <el-table-column v-for="column in tableColumns" :key="column.label" v-bind="column">
            <template v-slot="{row, cellValue}" v-if="column.prop === 'id'">
              <router-link :to="{name: 'stock.product.show', params: {id: row.id}}" class="table-action" data-toggle="tooltip" data-original-title="Show" >
                {{row.id}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column min-width="60px" align="right" label="Ações">
            <div slot-scope="{$index, row}" class="d-flex">
              <el-tooltip content="Visualizar" placement="top">
                <router-link :to="{name: 'stock.product.show', params: {id: row.id}}" class="table-action" data-toggle="tooltip" data-original-title="Show">
                  <i class="fas fa-eye"></i>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Editar" placement="top">
                <router-link :to="{name: 'stock.product.edit', params: {id: row.id}}" class="table-action" data-toggle="tooltip" data-original-title="Show">
                  <i class="fas fa-user-edit"></i>
                </router-link>
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
</template>

<style>
  .no-border-card .card-footer{
    border-top: 0;
  }
</style>

<script>
  import {http} from "@/services";
  import Fuse from 'fuse.js';

  import clientPaginationMixin from '@/mixins/client-pagination'

  import { BasePagination } from '@/components';
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';
  import {isEmpty} from 'lodash'

  export default {
    name: 'sub-index',
    mixins: [clientPaginationMixin],
    components: {
      BasePagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        products: this.data.products,
        fuseSearch: null,
        tableColumns: [
          {
            prop: 'id',
            label: 'id',
            minWidth: 220,
            sortable: true
          },
          {
            prop: 'price',
            label: 'Preço',
            minWidth: 150,
            sortable: true,
            formatter: function (row, column, cellValue, index) {
              return 'R$ ' + cellValue
            }
          },
          {
            prop: 'barcode',
            label: 'Código de Barra',
            minWidth: 220,
            sortable: true
          }
        ]
      }
    },
    mounted() {
      this.fuseSearch = new Fuse(this.products, {keys: ['id', 'price', 'barcode'], threshold: 0.3})
    },
    computed: {
      tableData() {
        return this.products
      }
    },
    methods: {
      searchApi(value) {
        return this.fuseSearch.search(value);
      }
    }
  };
</script>
