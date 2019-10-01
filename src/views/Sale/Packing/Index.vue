<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
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
            <el-table-column label="ID" sortable>
              <template v-slot="{row}">
                <router-link :to="{name: 'sale.packing.show', params: {id: row.id}}" class="table-action">{{row.id}}</router-link>
              </template>
            </el-table-column>
            <el-table-column label="Status" sortable>
              <template v-slot="{row}">
                <badge rounded :type="statusPacking(row.status).color">{{statusPacking(row.status).translate}}</badge>
              </template>
            </el-table-column>
            <el-table-column prop="seller.name" label="Vendedor" sortable/>
            <el-table-column label="Data de Criação" sortable>
              <template v-slot="{row}">
                {{row.created_at | formatDate}}
              </template>
            </el-table-column>

            <el-table-column min-width="60px" align="right" label="Ações">
              <div slot-scope="{$index, row}" class="d-flex">
                <el-tooltip content="Visualizar" placement="top">
                  <router-link :to="{name: 'sale.packing.show', params: {id: row.id}}" class="table-action">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Editar" placement="top" v-if="row.status === 'opened'">
                  <router-link :to="{name: 'sale.packing.edit', params: {id: row.id}}" class="table-action">
                    <i class="fas fa-pencil-alt"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Dar baixa" placement="top" v-if="row.status !== 'closed'">
                  <router-link :to="{name: 'sale.packing.checkout', params: {id: row.seller_id}}" class="table-action">
                    <i class="fas fa-cart-arrow-down"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Deletar" placement="top" v-if="row.status === 'opened'">
                  <a href="#!" @click.prevent="destroy(row)" class="table-action table-action-delete">
                    <i class="fas fa-trash-alt"></i>
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

<style>
  .no-border-card .card-footer{
    border-top: 0;
  }
</style>

<script>
  import clientPaginationMixin from '@/mixins/client-pagination';

  import { BasePagination } from '@/components';
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';

  import {http} from "@/services";
  import {notifyVue, notifyError, formatDate} from "@/utils";
  import {mapActions, mapState, mapMutations} from 'vuex';
  import {DELETE, GET_ALL, LOADING} from "@/store/modules/packing/packing-const";

  export default {
    name: 'index',
    mixins: [clientPaginationMixin],
    filters: {formatDate},
    components: {
      BasePagination,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    computed: {
      ...mapState('packing', {
        tableData: state => state.packings,
        loading: state => state.loading
      })
    },
    async created() {
      this.GET_ALL()
    },
    methods: {
      ...mapActions('packing', [GET_ALL, DELETE]),
      ...mapMutations('packing', [LOADING]),
      statusPacking(status) {
        const arr = {
          opened: {
            translate: 'Aberto',
            color: 'default'
          },
          in_transit: {
            translate: 'Em trânsito',
            color: 'info'
          },
          closed: {
            translate: 'Fechado',
            color: 'danger'
          }
        };

        return arr[status]
      },
      async searchApi(value) {
        let result = [];
        this.LOADING();

        await http.get('packings', {search: value})
          .then(response => result = response.data)
          .catch(error => console.dir(error));

        this.LOADING();
        return result || []
      },
      destroy(row) {
        this.DELETE(row)
          .then(res => notifyVue(this.$notify, 'O romaneio foi apagado!', 'success'))
          .catch(error => notifyError(this.$notify, error))
      }
    }
  };
</script>
