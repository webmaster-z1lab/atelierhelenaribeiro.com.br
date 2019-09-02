<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="!subIndex">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Lista de Romaneios</h3>
              <p class="text-sm mb-0">
                Lista de todos os romaneios(produtos que estão em rota de vendas).
              </p>
            </div>
            <div class="col-6 text-right">
              <el-tooltip content="Criar Novo Romaneio" placement="top">
                <router-link :to="{name: 'sale.packing.create'}" class="btn btn-icon btn-fab btn-sm btn-primary">
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
                  <a href="javascript:;" class="table-action" data-toggle="tooltip" data-original-title="Show">
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
  </div>
</template>

<script>
  import {http} from "@/services";

  import clientPaginationMixin from '@/mixins/client-pagination'

  import { BasePagination } from '@/components';
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';
  import {isEmpty} from 'lodash'

  export default {
    name: 'index',
    mixins: [clientPaginationMixin],
    components: {
      BasePagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        loading: true,
        products: [],
        subIndex: false,
        subProducts: [],
        tableColumns: [
          {
            prop: 'id',
            label: 'Id',
            minWidth: 220,
            sortable: true
          },
          {
            prop: 'color',
            label: 'Vendedor',
            minWidth: 150,
            sortable: true
          },
          {
            prop: 'status',
            label: 'Status',
            minWidth: 150,
            sortable: true
          },
          {
            prop: 'created_at',
            label: 'Data de Criação',
            minWidth: 150,
            sortable: true
          }
        ]
      }
    },
    computed: {
      tableData() {
        return this.packings
      }
    },
    async created() {
      await http.get(process.env.VUE_APP_API_URL + '/packings').then(res => this.packings = res.data);

      this.changeLoading()
    },
    methods: {
      async searchApi(value) {
        this.changeLoading();

        await http.get(process.env.VUE_APP_API_URL + '/packings', {search: value})
          .then(response => this.packings = response.data)
          .catch(error => console.dir(error));

        this.changeLoading();

        return this.packings || []
      }
    }
  };
</script>
