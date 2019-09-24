<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{packing.id}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do romaneio selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <router-link :to="{name: 'sale.packing.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
                <span class="btn-inner--icon"><i class="fas fa-user-edit"></i></span>
                <span class="btn-inner--text">Voltar</span>
              </router-link>
              <el-tooltip content="Editar Produto" placement="top">
                <router-link :to="{name: 'sale.packing.edit', params: {id: id}}" class="btn btn-icon btn-fab btn-sm btn-warning">
                  <span class="btn-inner--icon"><i class="fas fa-user-edit"></i></span>
                  <span class="btn-inner--text">Editar</span>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Apagar Produto" placement="top">
                <base-button type="danger" size="sm" @click="destroy">
                  <i class="fas fa-trash"></i>Deletar
                </base-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="mx-4">
          <ul class="list-group list-group-flush list mt--3">
            <div class="row align-items-center">
              <div class="col mb-4">
                <h4>Vendedor:</h4>
                <h5 class="mb-0">{{packing.seller.name}}</h5>
              </div>
              <div class="col-12 mb-4">
                <el-table :data="packing.products" header-row-class-name="thead-light">
                  <el-table-column prop="reference" label="Referência" sortable/>
                  <el-table-column prop="color" label="Cor" sortable/>
                  <el-table-column prop="size" label="Tamanho" sortable/>
                  <el-table-column prop="amount" label="Quantidade" sortable/>
                </el-table>
              </div>
            </div>
          </ul>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex';
  import {GET, DELETE} from "@/store/modules/packing/packing-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'
  import swal from 'sweetalert2';

  import Loading from '@/components/App/Loading';

  export default {
    name: 'show',
    components: {
      Loading,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState('packing', {
        loading: state => state.loading,
        packing: state => state.packing
      })
    },
    async created() {
      this.GET(this.id);
    },
    methods: {
      ...mapActions('packing', [GET, DELETE]),
      destroy() {
        this.DELETE(this.packing)
          .then(res => {
            notifyVue(this.$notify, 'O Romaneio foi apagado!', 'success')
            this.$router.push({name: 'sale.packing.index'})
          }).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
