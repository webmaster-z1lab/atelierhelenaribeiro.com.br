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
          <h3 class="mb-0">Criando Produto</h3>
          <p class="text-sm mb-0">
            Preencha os dados abaixo para adicionar um novo produto ao sistema.
          </p>
        </div>

        <form class="needs-validation" @submit.prevent="submitForm">
          <div class="form-row">
            <div class="col-lg-4">
              <base-input label="Referência" :error="getError('reference')" :valid="isValid('reference')">
                <el-select v-model="product.template" filterable placeholder="Selecione o modelo do produto." name="reference" v-validate="'required'"
                           :class="[{'is-invalid': getError('reference')}]">
                  <el-option v-for="option in templates" :key="option.id" :label="option.reference" :value="option.id"/>
                </el-select>
              </base-input>
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
              <base-input type="number" name="amount" label="Quantidade" v-model="amount" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço" v-model="product.price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required'"/>
            </div>
            <div class="col-lg-12">
              <dropzone-file-upload v-model="product.images" multiple/>
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
  import Template from "@/models/Catalog/Template";
  import MoneyInput from '@/components/App/Inputs/Money'
  import DropzoneFileUpload from '@/components/Inputs/DropzoneFileUpload'
  import crudSettingsMixin from '@/mixins/crud-settings'

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui'

  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      MoneyInput,
      DropzoneFileUpload,
      [Select.name]: Select,
      [Option.name]: Option,
    },
    data () {
      return {
        loading: true,
        amount: 1,
        product: new Product()
      }
    },
    computed: {
      templates() {
        return Template.all()
      }
    },
    async created() {
      await Template.$fetch();

      this.changeLoading();
    },
    methods: {
      setPriceBase(price) {
        console.log(price)
        this.product.price = price
      },
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                this.changeLoading();

                this.product.amount = this.amount;

                await Product.$create({data: this.product})
                  .then(response => {
                    notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                    this.$router.push({name: 'stock.product.show', params: {id: response.id}})
                  })
                  .catch(error => notifyError(this.$notify, error))
                  .finally(this.changeLoading());
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
