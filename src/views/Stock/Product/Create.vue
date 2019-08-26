<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

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
                           :class="[{'is-invalid': getError('reference')}]" @change="setPriceBase">
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
                  <option value="Nude">Nude</option>
                  <option value="Branco">Branco</option>
                  <option value="Preto">Preto</option>
                  <option value="Rose">Rose</option>
                  <option value="Rosa">Rosa</option>
                  <option value="Salmao">Salmao</option>
                  <option value="Pink">Pink</option>
                  <option value="Tifany">Tifany</option>
                  <option value="Verde acqua">Verde acqua</option>
                  <option value="Verde">Verde</option>
                  <option value="Esmeralda">Esmeralda</option>
                  <option value="Verde menta">Verde Menta</option>
                  <option value="Serenity">Serenity</option>
                  <option value="Azul claro">Azul claro</option>
                  <option value="Azul bic">Azul bic</option>
                  <option value="Azul marinho">Azul marinho</option>
                  <option value="Vermelho">Vermelho</option>
                  <option value="Marsala">Marsala</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <base-input type="number" name="amount" label="Quantidade" v-model="amount" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço" v-model="product.price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required|min_value:1'" :key="product.template"/>
            </div>
            <div class="col-lg-6">
              <div id="DashboardContainer"></div>
            </div>
            <div class="col-lg-6">
              <card body-classes="p-0" v-if="product.template">
                <h5 slot="header" class="h3 mb-0">Selecione as Imagens</h5>
                <ul class="list-group list-group-flush" data-toggle="checklist">
                  <li class="checklist-entry list-group-item flex-column align-items-start py-4 px-4" v-for="image in gallery" :key="image.id">
                    <div class="checklist-item">

                      <div class="checklist-info">
                        <img :src="image.url" alt="" width="15%">
                        <h5 class="checklist-title mb-0">{{image.name}}</h5>
                        <small>{{image.size_in_bytes}} Kbs</small>
                      </div>
                      <div>
                        <base-checkbox :value="image.id" v-model="product.template_images"/>
                      </div>
                    </div>
                  </li>
                </ul>
              </card>
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
  import Product from '@/models/Stock/Product';
  import Template from "@/models/Catalog/Template";

  import MoneyInput from '@/components/App/Inputs/Money';
  import crudSettingsMixin from '@/mixins/crud-settings';
  import clientUploadUppyMixin from '@/mixins/client-upload-uppy';

  import {notifyVue, notifyError} from "@/utils";
  import {isEmpty} from 'lodash';
  import { Select, Option } from 'element-ui'

  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin, clientUploadUppyMixin],
    components: {
      MoneyInput,
      [Select.name]: Select,
      [Option.name]: Option,
    },
    data () {
      return {
        gallery: [],
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
      setPriceBase(id) {
        this.$validator.pause();
        this.product.price = Template.find(id).price;
        http.get(process.env.VUE_APP_API_URL + `/templates/${id}/gallery`).then(res => {this.gallery = res.data})
      },
      async submitForm() {
        this.$validator.resume();
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                await this.changeLoading();
                this.product.amount = this.amount;
                this.product.images = [];
                if (isEmpty(this.product.template_images)) delete this.product.template_images

                if (isEmpty(this.uppy.getFiles())) {
                  await Product.$create({data: this.product})
                    .then(response => {
                      notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                      this.$router.push({name: 'stock.product.index'})
                    }).catch(error => notifyError(this.$notify, error));
                } else {
                  await this.uppy.setMeta({folder: `templates/${this.product.template}`});
                  await this.uppy.upload().then(async res => {
                    for (let image of res.successful) {
                      this.product.images.push({
                        path: image.s3Multipart.key,
                        name: image.data.name,
                        extension: image.extension,
                        mime_type:  image.type,
                        size_in_bytes:  image.size
                      })
                    }

                    await Product.$create({data: this.product})
                      .then(response => {
                        notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                        this.$router.push({name: 'stock.product.index'})
                      }).catch(error => notifyError(this.$notify, error));
                  }).catch(err => {throw err});
                }

                this.changeLoading();
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
