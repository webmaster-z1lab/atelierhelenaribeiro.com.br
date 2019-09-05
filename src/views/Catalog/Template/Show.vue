<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
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
            </li>
          </ul>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {GET, DELETE, DELETE_IMAGE} from "@/store/modules/template/template-const";

  import {notifyVue, notifyError} from "@/utils";
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
    computed: {
      ...mapState('template', {
        loading: state => state.loading,
        template: state => state.template
      })
    },
    async created() {
      this.GET(this.id);
    },
    methods: {
      ...mapActions('template', [GET, DELETE, DELETE_IMAGE]),
      deleteImage(id, key) {
        this.DELETE_IMAGE({id: id, key: key})
          .then(res => {
            notifyVue(this.$notify, 'O arquivo foi apagado!', 'success')
          }).catch(error => notifyError(this.$notify, error));
      },
      destroy() {
        this.DELETE(this.template)
          .then(res => {
            notifyVue(this.$notify, 'O modelo foi apagado!', 'success')
            this.$router.push({name: 'catalog.template.index'})
          }).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
