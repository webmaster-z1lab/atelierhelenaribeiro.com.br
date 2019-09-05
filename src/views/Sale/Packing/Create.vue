<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Criando Romaneio</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="col-lg-3">
              <base-input label="Vendedor" :error="getError('seller')" :valid="isValid('seller')">
                <el-select v-model="packing.seller" filterable placeholder="Selecione o representante do cliente." name="seller" v-validate="'required'" :class="[{'is-invalid': getError('seller')}]">
                  <el-option v-for="seller in sellers" :key="seller.id" :label="seller.name" :value="seller.id"/>
                </el-select>
              </base-input>
            </div>
          </div>

          <hr class="mb-4 mt-0">
          <h5 class="heading mb-4">Lista de Produtos</h5>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
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
          <el-table :data="packing.products" header-row-class-name="thead-light">
            <el-table-column prop="name" label="Código de Barra" sortable/>
            <el-table-column prop="name" label="Referência" sortable/>
            <el-table-column prop="name" label="Cor" sortable/>
            <el-table-column prop="name" label="Tamanho" sortable/>
            <el-table-column prop="name" label="Preço" sortable/>

            <el-table-column min-width="60px" align="right" label="Ações">
              <div slot-scope="{$index, row}" class="d-flex">
                <el-tooltip content="Deletar" placement="top">
                  <a href="#!" @click.prevent="destroy(row)" class="table-action table-action-delete" data-toggle="tooltip" data-original-title="Delete">
                    <i class="fas fa-trash"></i>
                  </a>
                </el-tooltip>
              </div>
            </el-table-column>
          </el-table>
          <hr class="my-4">
          <base-button type="primary" native-type="submit">Enviar</base-button>
          <base-button type="secondary" @click="$router.back()">Voltar</base-button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
  import MoneyInput from '@/components/App/Inputs/Money';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {notifyVue, notifyError} from "@/utils";
  import {isEmpty} from 'lodash';
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'

  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MoneyInput,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        loading: true,
        sellers: [],
        searchQuery: '',
        packing: new Packing()
      }
    },
    watch: {
      async searchQuery(value) {
        if (value !== '') {
          await http.get(process.env.VUE_APP_API_URL + '/products', {search: value}).then(response => this.packing.products.push(response.data)).catch(error => console.dir(error));
        }
      }
    },
    async created() {
      await http.get(process.env.VUE_APP_API_URL + '/employees', {search: 'seller'}).then(response => this.sellers = response.data).catch(error => console.dir(error));

      this.changeLoading();
    },
    methods: {
      async submitForm() {
        this.$validator.resume();
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                await this.changeLoading();
                this.product.amount = this.amount;
                this.product.images = [];
                if (isEmpty(this.product.template_images)) delete this.product.template_images;

                if (isEmpty(this.uppy.getFiles())) {
                  delete this.product.images;
                  await Product.$create({data: this.product})
                    .then(response => {
                      notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                      this.$router.push({name: 'stock.product.index'})
                    }).catch(error => notifyError(this.$notify, error));
                } else {
                  await this.uppy.setMeta({folder: `templates/${this.product.template}`});
                  await this.uppy.upload().then(async res => {
                    for (let image of res.successful) {
                      this.product.images.push({
                        path: image.s3Multipart.key,
                        name: image.data.name,
                        extension: image.extension,
                        mime_type:  image.type,
                        size_in_bytes:  image.size
                      })
                    }

                    await Product.$create({data: this.product})
                      .then(response => {
                        notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                        this.$router.push({name: 'stock.product.index'})
                      }).catch(error => notifyError(this.$notify, error));
                  }).catch(err => {throw err});
                }

                this.changeLoading();
              }
            }
          )
        } finally {
          this.validated = true;
        }
      }
    }
  };
</script>
