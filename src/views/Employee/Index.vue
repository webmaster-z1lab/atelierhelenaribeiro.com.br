<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">Paginated tables</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <route-bread-crumb/>
          </nav>
        </div>
      </div>
    </base-header>

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
            <el-table-column min-width="180px" align="right" label="Ações">
              <div slot-scope="{$index, row}" class="d-flex">
                <el-tooltip content="Visualizar" placement="top">
                  <router-link :to="{name: 'employee.show'}" class="table-action" data-toggle="tooltip" data-original-title="Show">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Editar" placement="top">
                  <router-link :to="{name: 'employee.edit'}" class="table-action" data-toggle="tooltip" data-original-title="Edit">
                    <i class="fas fa-user-edit"></i>
                  </router-link>
                </el-tooltip>
                <el-tooltip content="Deletar" placement="top">
                  <a href="#!" @click.prevent="handleDelete(row)" class="table-action table-action-delete" data-toggle="tooltip"
                     data-original-title="Delete">
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
  import Loading from '@/components/App/Loading'

  import {http, ls} from "@/services";
  import {notifyVue, notifyError} from "@/utils";
  import swal from 'sweetalert2';

  import clientPaginationMixin from '@/mixins/client-pagination'

  import { BasePagination } from '@/components';
  import RouteBreadCrumb from '@/components/Breadcrumb/RouteBreadcrumb'
  import { Table, TableColumn, Select, Option, Tooltip } from 'element-ui';

  export default {
    name: 'index',
    mixins: [clientPaginationMixin],
    components: {
      Loading,
      BasePagination,
      RouteBreadCrumb,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data: () => ({
      loading: false,
      tableColumns: [
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 160,
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
    }),
    computed: {
      tableData() {
        return Employee.all()
      }
    },
    created() {
      Employee.$fetch();
    },
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      async searchApi(value) {
        let result = [];

        await http.get(process.env.VUE_APP_API_URL + '/employees', {search: value}).then(
          async response => {
            result = await Promise.resolve(Employee.insert({data: response.data}));
          }
        ).catch(error => console.dir(error))

        return result.employees || []
      },
      handleDelete(index, row) {
        swal({
          title: 'Are you sure?',
          text: `You won't be able to revert this!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Yes, delete it!',
          buttonsStyling: false
        }).then(result => {
          if (result.value) {
            this.deleteRow(row);
            swal({
              title: 'Deleted!',
              text: `You deleted ${row.name}`,
              type: 'success',
              confirmButtonClass: 'btn btn-success btn-fill',
              buttonsStyling: false
            });
          }
        });
      },
      deleteRow(row) {
        let indexToDelete = this.tableData.findIndex(
          tableRow => tableRow.id === row.id
        );
        if (indexToDelete >= 0) {
          this.tableData.splice(indexToDelete, 1);
        }
      }
    }
  };
</script>
