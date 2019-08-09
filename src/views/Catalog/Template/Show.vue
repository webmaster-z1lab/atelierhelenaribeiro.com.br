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

    <div class="container-fluid mt--6" v-if="template">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{template.reference}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do modelo selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <base-button type="secondary" @click="$router.back()" size="sm">
                <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
                Voltar
              </base-button>
              <el-tooltip content="Editar Modelo" placement="top">
                <router-link :to="{name: 'catalog.template.edit', params: {id: id}}" class="btn btn-icon btn-fab btn-sm btn-warning">
                  <span class="btn-inner--icon"><i class="fas fa-user-edit"></i></span>
                  <span class="btn-inner--text">Editar</span>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Apagar Modelo" placement="top">
                <base-button type="danger" size="sm" @click="destroy">
                  <i class="fas fa-trash"></i>Deletar
                </base-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="mx-4">
          <ul class="list-group list-group-flush list mt--3">
            <li class="list-group-item px-0">
              <h6 class="heading-small text-muted mb-4">Informações do Modelo</h6>

              <div class="row align-items-center">
                <div class="col mb-4">
                  <h4>Modelo:</h4>
                  <h5 class="mb-0">{{template.template}}</h5>
                </div>
                <div class="col mb-4">
                  <h4>Preço Base:</h4>
                  <h5 class="mb-0">{{template.price}}</h5>
                </div>
                <div class="col mb-4">
                  <h4>Status:</h4>
                  <h5 class="mb-0">{{template.is_active}}</h5>
                </div>
              </div>

              <h6 class="heading-small text-muted mb-4">Album de Imagens</h6>

              <ul class="list-group list-group-flush" data-toggle="checklist">
                <li class="checklist-entry list-group-item flex-column align-items-start py-4 px-4" v-for="(image, key) in template.images" :key="image.id">
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
            </li>
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
  import Template from '@/models/Catalog/Template'

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
    data () {
      return {
        loading: true
      }
    },
    computed: {
      template() {
        return Template.find(this.id)
      }
    },
    async created() {
      if (!this.template) await Template.$get({params: {id: this.id}})

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
            await http.delete(process.env.VUE_APP_API_URL + `/images/${id}/templates/${this.id}`)
              .then(res => {
                let template = this.template;
                template.images.splice(key, 1);

                Template.update({where: id, data: {template}})
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
            this.changeLoading();

            await Template.$delete({params: {id: this.id}})
              .then(response => {
                notifyVue(this.$notify, 'O Modelo foi apagado!', 'success');
                this.$router.push({name: 'catalog.template.index'})
              })
              .catch(error => notifyError(this.$notify, error))

            this.changeLoading()
          }
        });
      }
    }
  };
</script>
