<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Editando Modelo</h3>
          <p class="text-sm mb-0">
            Modifique os dados abaixo para atualizar as informações do modelo.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="col-lg-4">
              <base-input label="Referência" :value="template.reference" name="reference" disabled="true"/>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço Base" v-model="template.price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required'" :key="template.id"/>
            </div>
            <div class="col-lg-3 ml-3">
              <label class="form-control-label">Modelo Ativo?</label>
              <div class="align-self-end mt-2">
                <base-switch v-model="template.is_active" onText="Sim" offText="Não"/>
              </div>
            </div>
            <div class="col-lg-12">
              <div id="DashboardContainer"></div>
            </div>
          </div>

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
  import clientUploadUppyMixin from '@/mixins/client-upload-uppy';

  import {mapActions, mapState} from 'vuex';
  import {EDIT, GET} from "@/store/modules/template/template-const";

  import {notifyVue, notifyError} from "@/utils";
  import {isEmpty} from 'lodash';
  import {http} from "@/services";

  export default {
    name: 'edit',
    mixins: [crudSettingsMixin, clientUploadUppyMixin],
    props:{
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        images: []
      }
    },
    components: {
      MoneyInput
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
      ...mapActions('template', [GET, EDIT]),
      submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                delete this.template.reference;

                if (isEmpty(this.uppy.getFiles())) {
                  delete this.template.images;

                  this.EDIT(this.template).then(res => {
                    notifyVue(this.$notify, 'Modelo atualizado com sucesso', 'success');
                    this.$router.push({name: 'catalog.template.index'})
                  }).catch(error => notifyError(this.$notify, error));
                } else {
                  await this.uppy.setMeta({folder: 'templates'});
                  await this.uppy.upload().then(async res => {
                    for (let image of res.successful) {
                      this.images.push({
                        path: image.s3Multipart.key,
                        name: image.data.name,
                        extension: image.extension,
                        mime_type:  image.type,
                        size_in_bytes:  image.size
                      })
                    }

                    this.template.images = this.images;

                    this.EDIT(this.template).then(res => {
                      notifyVue(this.$notify, 'Modelo atualizado com sucesso', 'success');
                      this.$router.push({name: 'catalog.template.index'})
                    }).catch(error => notifyError(this.$notify, error));
                  }).catch(err => {throw err});
                }
              }
            }
          ).catch(e => notifyVue(this.$notify, e, 'danger', 'ni ni-fat-remove'))
        } finally {
          this.validated = true;
        }
      }
    }
  };
</script>
