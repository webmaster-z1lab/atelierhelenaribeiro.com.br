<template>
  <div class="content">
    <loading :loading="loading"/>

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
              <dropzone-file-upload v-model="images" multiple />
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
  import DropzoneFileUpload from '@/components/Inputs/DropzoneFileUpload'
  import crudSettingsMixin from '@/mixins/crud-settings'

  import {notifyVue, notifyError} from "@/utils";

  import {http} from "@/services";
  import {isEmpty} from 'lodash'

  export default {
    name: 'edit',
    mixins: [crudSettingsMixin],
    props:{
      id: {
        type: String,
        required: true
      }
    },
    components: {
      MoneyInput,
      DropzoneFileUpload
    },
    data () {
      return {
        loading: true,
        images: [],
        template: Template.find(this.id)
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
            res => {
              if (res) {
                this.changeLoading();

                isEmpty(this.image) ? delete this.template.images : this.template.images = this.images;
                delete this.template.reference;

                Template.$update({params: {id: this.id}, data: this.template})
                  .then(res => notifyVue(this.$notify, 'Modelo atualizado com sucesso', 'success'))
                  .catch(error => notifyError(this.$notify, error))
                  .finally(this.changeLoading())
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

<style>
  @media (min-width: 992px) {
    .d-lg-block {
      display: inline !important;
    }
  }
</style>
