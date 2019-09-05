<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
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
            <div class="col-lg-6"></div>
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
        gallery: [],
        loading: true,
        product: Product.find(this.id) || {template: {}}
      }
    },
    async created() {
      if (isEmpty(this.product.template)) this.product = await Product.$get({params: {id: this.id}});
      await http.get(process.env.VUE_APP_API_URL + `/templates/${this.product.template_id}/gallery`).then(res => {this.gallery = res.data});

      this.changeLoading();
    },
    methods: {
      submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                await this.changeLoading();
                this.product.images = [];
                if (isEmpty(this.product.template_images)) delete this.product.template_images

                if (isEmpty(this.uppy.getFiles())) {
                  delete this.product.images;
                  await Product.$update({params: {id: this.id}, data: this.product})
                    .then(res => notifyVue(this.$notify, 'Produto atualizado com sucesso', 'success'))
                    .catch(error => notifyError(this.$notify, error));
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

                    await Product.$update({params: {id: this.id}, data: this.product})
                      .then(res => notifyVue(this.$notify, 'Produto atualizado com sucesso', 'success'))
                      .catch(error => notifyError(this.$notify, error));
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
