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
              <money-input label="Preço Base" v-model="template.price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required'"/>
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
  import Template from '@/models/Catalog/Template'
  import MoneyInput from '@/components/App/Inputs/Money'
  import crudSettingsMixin from '@/mixins/crud-settings'
  import clientUploadUppyMixin from '@/mixins/client-upload-uppy';

  import {notifyVue, notifyError} from "@/utils";

  import {http} from "@/services";
  import {isEmpty} from 'lodash'

  export default {
    name: 'edit',
    mixins: [crudSettingsMixin, clientUploadUppyMixin],
    props:{
      id: {
        type: String,
        required: true
      }
    },
    components: {
      MoneyInput
    },
    data () {
      return {
        loading: true,
        template: Template.find(this.id) || []
      }
    },
    async created() {
      if (!this.template) this.template = await Template.$get({params: {id: this.id}});

      this.changeLoading();
    },
    methods: {
      submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                await this.changeLoading();

                this.template.images = [];
                delete this.template.reference;

                if (isEmpty(this.uppy.getFiles())) {
                  delete this.template.images;
                  await Template.$update({params: {id: this.id}, data: this.template})
                    .then(res => notifyVue(this.$notify, 'Modelo atualizado com sucesso', 'success'))
                    .catch(error => notifyError(this.$notify, error))
                } else {
                  await this.uppy.setMeta({folder: 'templates'});
                  await this.uppy.upload().then(async res => {
                    for (let image of res.successful) {
                      this.template.images.push({
                        path: image.s3Multipart.key,
                        name: image.data.name,
                        extension: image.extension,
                        mime_type:  image.type,
                        size_in_bytes:  image.size
                      })
                    }

                    await Template.$update({params: {id: this.id}, data: this.template})
                      .then(res => notifyVue(this.$notify, 'Modelo atualizado com sucesso', 'success'))
                      .catch(error => notifyError(this.$notify, error));
                  }).catch(err => {throw err});
                }

                this.changeLoading()
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
