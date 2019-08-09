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
              <base-input label="Modelo" v-model="template.reference" name="reference" :error="getError('reference')" :valid="isValid('reference')" v-validate="'required'"/>
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
              <dropzone-file-upload v-model="template.images" multiple />
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

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MoneyInput,
      DropzoneFileUpload
    },
    data () {
      return {
        loading: true,
        template: new Template(),
        test: []
      }
    },
    async created(){
      await http.get(process.env.VUE_APP_API_URL + '/templates/reference')
        .then(response => this.template.reference = response.data.reference)
        .catch(error => console.dir(error));

      this.changeLoading()
    },
    methods: {
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.changeLoading();

                await Template.$create({data: this.template}).then(response => {
                    notifyVue(this.$notify, 'Modelo criado com sucesso', 'success');
                    this.$router.push({name: 'catalog.template.show', params: {id: response.id}})
                  }).catch(error => notifyError(this.$notify, error)).finally(this.changeLoading());
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
