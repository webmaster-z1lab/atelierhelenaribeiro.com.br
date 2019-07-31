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
              <base-input v-model="searchQuery" prepend-icon="fas fa-search" placeholder="Buscar..."/>
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
      propsToSearch: ['name', 'email'],
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
      ],
      tableData: [
        {
          id: 1,
          name: "Tiger Nixon",
          position: "System Architect",
          city: "Edinburgh",
          age: "61",
          createdAt: "2011/04/25",
          salary: "$320,800",
        },
        {
          id: 2,
          name: "Garrett Winters",
          position: "Accountant",
          city: "Tokyo",
          age: "63",
          createdAt: "2011/07/25",
          salary: "$170,750",
        },
        {
          id: 3,
          name: "Ashton Cox",
          position: "Junior Technical Author",
          city: "San Francisco",
          age: "66",
          createdAt: "2009/01/12",
          salary: "$86,000",
        },
        {
          id: 4,
          name: "Cedric Kelly",
          position: "Senior Javascript Developer",
          city: "Edinburgh",
          age: "22",
          createdAt: "2012/03/29",
          salary: "$433,060",
        },
        {
          id: 5,
          name: "Airi Satou",
          position: "Accountant",
          city: "Tokyo",
          age: "33",
          createdAt: "2008/11/28",
          salary: "$162,700",
        },
        {
          id: 6,
          name: "Brielle Williamson",
          position: "Integration Specialist",
          city: "New York",
          age: "61",
          createdAt: "2012/12/02",
          salary: "$372,000",
        },
        {
          id: 7,
          name: "Herrod Chandler",
          position: "Sales Assistant",
          city: "San Francisco",
          age: "59",
          createdAt: "2012/08/06",
          salary: "$137,500",
        },
        {
          id: 8,
          name: "Rhona Davidson",
          position: "Integration Specialist",
          city: "Tokyo",
          age: "55",
          createdAt: "2010/10/14",
          salary: "$327,900",
        },
        {
          id: 9,
          name: "Colleen Hurst",
          position: "Javascript Developer",
          city: "San Francisco",
          age: "39",
          createdAt: "2009/09/15",
          salary: "$205,500",
        },
        {
          id: 10,
          name: "Sonya Frost",
          position: "Software Engineer",
          city: "Edinburgh",
          age: "23",
          createdAt: "2008/12/13",
          salary: "$103,600",
        },
        {
          id: 11,
          name: "Jena Gaines",
          position: "Office Manager",
          city: "London",
          age: "30",
          createdAt: "2008/12/19",
          salary: "$90,560",
        },
        {
          id: 12,
          name: "Quinn Flynn",
          position: "Support Lead",
          city: "Edinburgh",
          age: "22",
          createdAt: "2013/03/03",
          salary: "$342,000",
        },
        {
          id: 13,
          name: "Charde Marshall",
          position: "Regional Director",
          city: "San Francisco",
          age: "36",
          createdAt: "2008/10/16",
          salary: "$470,600",
        },
        {
          id: 14,
          name: "Haley Kennedy",
          position: "Senior Marketing Designer",
          city: "London",
          age: "43",
          createdAt: "2012/12/18",
          salary: "$313,500",
        },
        {
          id: 15,
          name: "Tatyana Fitzpatrick",
          position: "Regional Director",
          city: "London",
          age: "19",
          createdAt: "2010/03/17",
          salary: "$385,750",
        },
        {
          id: 16,
          name: "Michael Silva",
          position: "Marketing Designer",
          city: "London",
          age: "66",
          createdAt: "2012/11/27",
          salary: "$198,500",
        },
        {
          id: 17, name: "Paul Byrd",
          position: "Chief Financial Officer (CFO)",
          city: "New York",
          age: "64",
          createdAt: "2010/06/09",
          salary: "$725,000",
        },
        {
          id: 18, name: "Gloria Little",
          position: "Systems Administrator",
          city: "New York",
          age: "59",
          createdAt: "2009/04/10",
          salary: "$237,500",
        }
      ]
    }),
    methods: {
      changeLoading() {
        this.loading = !this.loading
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
