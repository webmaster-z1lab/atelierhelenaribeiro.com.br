<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card>
        <div slot="header">
          <h3 class="mb-0">Criando Modelo</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo para adicionar um novo modelo ao sistema.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="col-lg-4">
              <base-input label="Modelo" v-model="reference" name="reference" :error="getError('reference')" :valid="isValid('reference')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço Base" v-model="price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required|min_value:1'"/>
            </div>
            <div class="col-lg-3 ml-3">
              <label class="form-control-label">Modelo Ativo?</label>
              <div class="align-self-end mt-2">
                <base-switch v-model="is_active" onText="Sim" offText="Não"/>
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
  import {CREATE} from "@/store/modules/template/template-const";

  import {notifyVue, notifyError} from "@/utils";
  import {isEmpty} from 'lodash'
  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin, clientUploadUppyMixin],
    components: {
      MoneyInput
    },
    data () {
      return {
        price: 0,
        reference: '',
        is_active: true,
        images: []
      }
    },
    computed: {
      ...mapState('template', {
        loading: state => state.loading
      })
    },
    async created() {
      await http.get('templates/reference').then(response => this.reference = response.data.reference).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('template', [CREATE]),
      submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                if (isEmpty(this.uppy.getFiles())) throw 'Adicione uma Imagem!';

                const {price, reference, is_active, images} = this;
                await this.uppy.setMeta({folder: 'templates'});

                await this.uppy.upload().then(async res => {
                  for (let image of res.successful) {
                    images.push({
                      path: image.s3Multipart.key,
                      name: image.data.name,
                      extension: image.extension,
                      mime_type:  image.type,
                      size_in_bytes:  image.size
                    })
                  }

                  this.CREATE({price, reference, is_active, images})
                    .then(response => {
                      notifyVue(this.$notify, 'Modelo criado com sucesso', 'success');
                      this.$router.push({name: 'catalog.template.show', params: {id: response.id}})
                    })
                    .catch(error => notifyError(this.$notify, error));
                }).catch(err => {throw err});
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
