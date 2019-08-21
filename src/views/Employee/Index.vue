<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Lista de Funcionários</h3>
              <p class="text-sm mb-0">
                Lista de todos os funcionários cadastrados no sistema.
              </p>
            </div>
            <div class="col-6 text-right">
              <el-tooltip content="Criar Novo Funcionário" placement="top">
                <router-link :to="{name: 'employee.create'}" class="btn btn-icon btn-fab btn-sm btn-primary">
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
                  <router-link :to="{name: 'employee.show', params: {id: row.id}}" class="table-action" data-toggle="tooltip" data-original-title="Show">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Editar" placement="top">
                  <router-link :to="{name: 'employee.edit', params: {id: row.id}}" class="table-action" data-toggle="tooltip" data-original-title="Edit">
                    <i class="fas fa-user-edit"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Deletar" placement="top">
                  <a href="#!" @click.prevent="destroy(row)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                    <i class="fas fa-trash"></i>
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
  import Employee from '@/models/Employee'

  import {http} from "@/services";
  import {notifyVue, notifyError} from "@/utils";
  import swal from 'sweetalert2';

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
        tableColumns: [
          {
            prop: 'name',
            label: 'Nome',
            minWidth: 220,
            sortable: true
          },
          {
            prop: 'email',
            label: 'Email',
            minWidth: 220,
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
        return Employee.all()
      }
    },
    created() {
      Employee.$fetch();
    },
    methods: {
      async searchApi(value) {
        let result = [];
        this.changeLoading();

        await http.get(process.env.VUE_APP_API_URL + '/employees', {search: value}).then(
          async response => {
            result = await Promise.resolve(Employee.insert({data: response.data}));
          }
        ).catch(error => console.dir(error)).finally(this.changeLoading());

        return result.employees || []
      },
      destroy(row) {
        swal({
          title: 'Você tem Certeza?',
          text: `Ao fazer isso os dados não poderão ser recuperados!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Sim, apagar!',
          cancelButtonText: 'Cancelar',
          buttonsStyling: false
        }).then(async result => {
          if (result.value) {
            await this.changeLoading();

            await Employee.$delete({params: {id: row.id}})
              .then(response => notifyVue(this.$notify, 'O funcionário foi apagado!', 'success'))
              .catch(error => notifyError(this.$notify, error))

            this.changeLoading()
          }
        });
      }
    }
  };
</script>
