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
                <el-select v-model="template" filterable placeholder="Selecione o modelo do produto." name="reference" v-validate="'required'"
                           :class="[{'is-invalid': getError('reference')}]" @change="setPriceBase">
                  <el-option v-for="option in templates" :key="option.id" :label="option.reference" :value="option.id"/>
                </el-select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <base-input label="Tamanho" :error="getError('size')" :valid="isValid('size')">
                <select name="size" class="form-control" v-model="size" :class="[{'is-invalid': getError('size')}]" v-validate="'required'">
                  <option value="" selected>Selecione o tamanho do produto.</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="Plus 1">PLUS 1</option>
                  <option value="Plus 2">PLUS 2</option>
                  <option value="Plus 3">PLUS 3</option>
                </select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <base-input label="Cor" :error="getError('color')" :valid="isValid('color')">
                <el-select v-model="color" filterable default-first-option allow-create placeholder="Selecione a cor do produto." name="color"
                           v-validate="'required'" :class="[{'is-invalid': getError('color')}]">
                  <el-option v-for="color in colors" :key="color.id" :label="color.name" :value="color.name"/>
                </el-select>
              </base-input>
            </div>
            <div class="col-lg-4">
              <base-input type="number" name="amount" label="Quantidade" v-model="amount" :error="getError('amount')" :valid="isValid('amount')" v-validate="'required'"/>
            </div>
            <div class="col-lg-4">
              <money-input label="Preço" v-model="price" name="price" :error="getError('price')" :valid="isValid('price')" v-validate="'required|min_value:1'" :key="template"/>
            </div>
            <div class="col-lg-6">
              <div id="DashboardContainer"></div>
            </div>
            <div class="col-lg-6">
              <card body-classes="p-0" v-if="template">
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
                        <base-checkbox :value="image.id" v-model="template_images"/>
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
  import MoneyInput from '@/components/App/Inputs/Money';
  import crudSettingsMixin from '@/mixins/crud-settings';
  import clientUploadUppyMixin from '@/mixins/client-upload-uppy';

  import {mapActions, mapState} from 'vuex';
  import {CREATE} from "@/store/modules/product/product-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui'
  import {isEmpty, find} from 'lodash';
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
        template: '',
        size: '',
        color: '',
        amount: 1,
        images: [],
        template_images: [],
        price: 0,
        gallery: [],
        templates: [],
        colors: []
      }
    },
    computed: {
      ...mapState('product', {
        loading: state => state.loading
      })
    },
    async created() {
      await http.get('templates').then(res => {this.templates = res.data});
      await http.get('colors').then(res => {this.colors = res.data});
    },
    methods: {
      ...mapActions('product', [CREATE]),
      setPriceBase(id) {
        this.$validator.pause();
        this.price = find(this.templates, ['id', id]).price;
        http.get(`templates/${id}/gallery`).then(res => {this.gallery = res.data})
      },
      async submitForm() {
        this.$validator.resume();
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                const {template, size, color, amount, images, template_images, price} = this,
                  data = {template, size, color, amount, images, template_images, price};

                if (isEmpty(template_images)) delete data.template_images;

                if (isEmpty(this.uppy.getFiles())) {
                  delete data.images;

                  this.CREATE(data)
                    .then(response => {
                      notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                      this.$router.push({name: 'stock.product.index'})
                    })
                    .catch(error => notifyError(this.$notify, error));
                } else {
                  await this.uppy.setMeta({folder: `templates/${template}`});
                  await this.uppy.upload().then(async res => {
                    for (let image of res.successful) {
                      data.images.push({
                        path: image.s3Multipart.key,
                        name: image.data.name,
                        extension: image.extension,
                        mime_type:  image.type,
                        size_in_bytes:  image.size
                      })
                    }

                    this.CREATE(data).then(response => {
                        notifyVue(this.$notify, 'Produto criado com sucesso', 'success');
                        this.$router.push({name: 'stock.product.index'})
                      })
                      .catch(error => notifyError(this.$notify, error));
                  }).catch(err => {throw err});
                }
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
