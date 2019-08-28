<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="template">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Modelo {{template.reference}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do modelo selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <router-link :to="{name: 'catalog.template.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
                <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
                <span class="btn-inner--text">Voltar</span>
              </router-link>
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
                  <h5 class="mb-0">{{template.reference}}</h5>
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
                      <img :src="image.thumbnail_url" alt="" class="img img-thumbnail" width="50%">
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
              <div>
                <image-test style="width: 100px; height: 100px" src="https://storage-chr.s3.us-east-2.amazonaws.com/images/templates/5d61ba1fdd04072218006f68/ba296fa4-85c4-4198-9524-600785d28c39__thumbnail.webp?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQCZH45UORNS2NQ6Q%2F20190826%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20190826T210838Z&X-Amz-SignedHeaders=host&X-Amz-Expires=1800&X-Amz-Signature=c48a7de44bbd6e98b159f40b372f258a409c416ad077ee0330f2aea62e770713"/>
              </div>
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
  import {http} from "@/services";
  import swal from 'sweetalert2';

  import Loading from '@/components/App/Loading'

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
            await this.changeLoading();

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
