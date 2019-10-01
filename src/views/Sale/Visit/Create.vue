<template>
  <div class="content">
    <loading :loading="loading"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <div class="col-12">
        <card>
          <div slot="header">
            <h3 class="mb-0">Nova visita</h3>
          </div>

          <form class="needs-validation" @submit.prevent="submitForm">
            <div class="row">
              <div class="col-4">
                <base-input label="Cliente" :error="getError('customer')" :valid="isValid('customer')">
                  <el-select v-model="customer" filterable placeholder="Selecione o cliente." name="customer" v-validate="'required'" :class="[{'is-invalid': getError('customer')}]">
                    <el-option v-for="item in customers" :key="item.id" :label="item.company_name" :value="item.id"/>
                  </el-select>
                </base-input>
              </div>
              <div class="col-4">
                <base-input label="Vendedor" :error="getError('seller')" :valid="isValid('seller')">
                  <el-select v-model="seller" filterable placeholder="Selecione o vendedor." name="seller" v-validate="'required'" :class="[{'is-invalid': getError('seller')}]">
                    <el-option v-for="item in sellers" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </base-input>
              </div>
              <div class="col-4">
                <mask-input name="date" placeholder="##/##/####" label="Data da Visita" v-model="date" :mask="'##/##/####'" :masked="true" validate="required|date_format:dd/MM/yyyy|before_today"/>
              </div>
              <div class="col-12">
                <label class="form-control-label">Anotações</label>
                <html-editor v-model="annotations" name="annotations"></html-editor>
              </div>
            </div>

            <base-button type="primary" native-type="submit">Salvar</base-button>
            <base-button type="secondary" @click="$router.back()">Voltar</base-button>
          </form>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
  import MaskInput from '@/components/App/Inputs/Mask';
  import HtmlEditor from '@/components/Inputs/HtmlEditor';
  import crudSettingsMixin from '@/mixins/crud-settings';

  import {mapActions, mapState} from 'vuex';
  import {CREATE} from "@/store/modules/visit/visit-const";

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option } from 'element-ui';
  import {http} from "@/services";

  export default {
    name: 'create',
    mixins: [crudSettingsMixin],
    components: {
      HtmlEditor,
      MaskInput,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data () {
      return {
        date: '',
        annotations: '',
        customer: '',
        seller: '',
        sellers: [],
        customers: []
      }
    },
    computed: {
      ...mapState('visit', {
        loading: state => state.loading
      })
    },
    async created() {
      await http.get('customers').then(response => this.customers = response.data).catch(error => console.dir(error));
      await http.get('employees', {search: 'seller'}).then(response => this.sellers = response.data).catch(error => console.dir(error));
    },
    methods: {
      ...mapActions('visit', [CREATE]),
      async submitForm() {
        try {
          this.$validator.validateAll().then(
            async res => {
              if (res) {
                const {date, customer, annotations, seller} = this;

                await this.CREATE({date, customer, annotations, seller})
                  .then(async response => {
                    notifyVue(this.$notify, 'Visita iníciada com sucesso', 'success');
                    await this.$router.push({name: 'sale.visit.edit', params: {id: response.id}})
                  })
                  .catch(error => notifyError(this.$notify, error));
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
