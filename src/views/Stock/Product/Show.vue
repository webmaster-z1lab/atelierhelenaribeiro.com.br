<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="product">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{product.reference}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do produto selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <base-button type="secondary" @click="$router.back()" size="sm">
                <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
                Voltar
              </base-button>
              <el-tooltip content="Editar Produto" placement="top">
                <router-link :to="{name: 'stock.product.edit', params: {id: id}}" class="btn btn-icon btn-fab btn-sm btn-warning">
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
            <h6 class="heading-small text-muted mb-4">Informações do Produto</h6>

            <div class="row align-items-center">
              <div class="col mb-4">
                <h4>Referência:</h4>
                <h5 class="mb-0">{{product.reference}}</h5>
              </div>
              <div class="col mb-4">
                <h4>Preço:</h4>
                <h5 class="mb-0">{{product.price}}</h5>
              </div>
              <div class="col mb-4">
                <h4>Cor:</h4>
                <h5 class="mb-0">{{product.color}}</h5>
              </div>
              <div class="col mb-4">
                <h4>Tamanho:</h4>
                <h5 class="mb-0">{{product.size}}</h5>
              </div>
            </div>

            <h6 class="heading-small text-muted mb-4">Album de Imagens</h6>

            <ul class="list-group list-group-flush" data-toggle="checklist">
              <li class="checklist-entry list-group-item flex-column align-items-start py-4 px-4" v-for="(image, key) in product.images" :key="image.id">
                <div class="checklist-item">
                  <div class="checklist-info">
                    <h5 class="checklist-title mb-0">{{image.name}}</h5>
                    <small>{{Number((image.size_in_bytes / 1024).toFixed(1))}} kb</small>
                  </div>
                  <div>
                    <base-button type="danger" size="sm" @click="deleteImage(image.id, key)">
                      <i class="fas fa-trash"></i>
                    </base-button>
                  </div>
                </div>
              </li>
            </ul>
          </ul>
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
  import Product from '@/models/Stock/Product'

  import {notifyVue, notifyError} from "@/utils";
  import swal from 'sweetalert2';

  import Loading from '@/components/App/Loading'
  import {http} from "@/services";

  export default {
    name: 'show',
    components: {
      Loading
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data: () => ({
      loading: true,
    }),
    computed: {
      product() {
        return Product.find(this.id)
      }
    },
    async created() {
      if (!this.product) await Product.$get({params: {id: this.id}});

      this.changeLoading()
    },
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      deleteImage(id, key) {
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
            this.changeLoading();
            await http.delete(process.env.VUE_APP_API_URL + `/images/${id}/products/${this.id}`)
              .then(res => {
                let product = this.product;
                product.images.splice(key, 1);

                Product.update({where: id, data: {product}})
                  .then(response => notifyVue(this.$notify, 'O Arquivo foi apagado!', 'success'))
                  .catch(error => notifyError(this.$notify, error))
              })
              .catch(error => notifyError(this.$notify, error));

            this.changeLoading();
          }
        });
      },
      destroy() {
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

            await Product.$delete({params: {id: this.id}})
              .then(response => {
                notifyVue(this.$notify, 'O Produto foi apagado!', 'success');
                this.$router.push({name: 'stock.product.index'})
              }).catch(error => notifyError(this.$notify, error))

            this.changeLoading()
          }
        });
      }
    }
  };
</script>
