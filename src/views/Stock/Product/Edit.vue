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

    <div class="container-fluid mt--6" v-if="product">
      <card>
        <div slot="header">
          <h3 class="mb-0">Editando Produto</h3>
          <p class="text-sm mb-0">
            Modifique os dados abaixo para atualizar informações do produto.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="col-lg-4">
              <base-input label="Modelo" :value="product.template.reference" name="reference" disabled="true"/>
            </div>
            <div class="col-lg-4">
              <base-input label="Tamanho" :error="getError('size')" :valid="isValid('size')">
                <select name="size" class="form-control" v-model="product.size" :class="[{'is-invalid': getError('size')}]" v-validate="'required'">
                  <option value="" selected>Selecione o tamanho do produto.</option>
                  <option value="p">P</option>
                  <option value="m">M</option>
                  <option value="g">G</option>
                  <option value="plus1">PLUS 1</option>
                  <option value="plus2">PLUS 2</option>
                  <option value="plus3">PLUS 3</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <base-input label="Cor" :error="getError('color')" :valid="isValid('color')">
                <select name="color" class="form-control" v-model="product.color" :class="[{'is-invalid': getError('color')}]" v-validate="'required'">
                  <option value="" selected>Selecione a cor do produto.</option>
                  <option value="azul">Azul</option>
                  <option value="branco">Branco</option>
                  <option value="preto">Preto</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço" v-model="product.price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required'"/>
            </div>
            <div class="col-lg-12">
              <dropzone-file-upload v-model="images" multiple/>
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
  import Product from '@/models/Stock/Product'
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
        product: Product.find(this.id)
      }
    },
    async created() {
      if (!this.product) this.product = await Product.$get({params: {id: this.id}});

      this.changeLoading();
    },
    methods: {
      submitForm() {
        try {
          this.$validator.validateAll().then(
            res => {
              if (res) {
                this.changeLoading();

                isEmpty(this.image) ? delete this.product.images : this.product.images = this.images;
                if (this.product.price === 0) delete this.product.price;

                Product.$update({params: {id: this.id}, data: this.product})
                  .then(res => {
                    notifyVue(this.$notify, 'Produto atualizado com sucesso', 'success')
                  })
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
