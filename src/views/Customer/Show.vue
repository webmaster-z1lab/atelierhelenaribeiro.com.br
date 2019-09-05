<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="customer">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{customer.name}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do cliente selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <router-link :to="{name: 'customer.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
                <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
                <span class="btn-inner--text">Voltar</span>
              </router-link>
              <el-tooltip content="Editar Cliente" placement="top">
                <router-link :to="{name: 'customer.edit', params: {id: id}}" class="btn btn-icon btn-fab btn-sm btn-warning">
                  <span class="btn-inner--icon"><i class="fas fa-user-edit"></i></span>
                  <span class="btn-inner--text">Editar</span>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Apagar Cliente" placement="top">
                <base-button type="danger" size="sm" @click="destroy">
                  <i class="fas fa-trash"></i>Deletar
                </base-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="mx-4">
          <ul class="list-group list-group-flush list mt--3">
            <li class="list-group-item px-0">
              <div class="row">
                <div class="col-lg-4">
                  <h6 class="heading-small text-muted mb-4">Informações do Cliente</h6>

                  <div class="row align-items-center">
                    <div class="col-12 mb-4">
                      <h4>Nome da Empresa:</h4>
                      <h5 class="mb-0">{{customer.company_name}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Nome Fantasia:</h4>
                      <h5 class="mb-0">{{customer.trading_name}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Documento:</h4>
                      <h5 class="mb-0">{{customer.document}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Inscrição Estadual:</h4>
                      <h5 class="mb-0">{{customer.state_registration}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Inscrição Municipal:</h4>
                      <h5 class="mb-0">{{customer.municipal_registration}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Status:</h4>
                      <h5 class="mb-0">{{customer.status}}</h5>
                    </div>
                    <div class="col-12 mb-4">
                      <h4>Representante:</h4>
                      <h5 class="mb-0">{{customer.seller}}</h5>
                    </div>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="row">
                    <div class="col-12">
                      <h6 class="heading-small text-muted mb-4">Dados de Contato</h6>

                      <div class="row align-items-center">
                        <div class="col mb-4">
                          <h4>Nome do Contato:</h4>
                          <h5 class="mb-0">{{customer.contact}}</h5>
                        </div>
                        <div class="col mb-4">
                          <h4>Email da Empresa:</h4>
                          <h5 class="mb-0">{{customer.email}}</h5>
                        </div>
                        <div class="col mb-4">
                          <h4>Endereço:</h4>
                          <h5 class="mb-0">{{customer.address.formatted}}</h5>
                        </div>
                        <div class="col mb-4" v-for="(phone, key) in customer.phones" :key="`phone-${key}`">
                          <h4>Telefone {{++key}}:</h4>
                          <h5 class="mb-0">
                            <i :class="phone.is_whatsapp ? 'fab fa-whatsapp mr-1' : 'fas fa-phone mr-1'"></i> {{phone.formatted}}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div class="col-12">
                      <h6 class="heading-small text-muted mb-4">Dados do(s) Proprietário(s)</h6>

                      <ul class="list-group list-group-flush" data-toggle="checklist">
                        <li class="checklist-entry list-group-item flex-column align-items-start py-4 px-4" v-for="owner in customer.owners" :key="owner.id">
                          <div class="checklist-item">
                            <div class="checklist-info">
                              <h5 class="checklist-title mb-0">{{owner.name}}</h5>
                              <small><strong>Email: </strong> {{owner.email}}</small>
                              <small class="mx-3">
                                <strong>Contato: </strong>
                                <i :class="owner.phone.is_whatsapp ? 'fab fa-whatsapp mr-1' : 'fas fa-phone mr-1'"></i> {{owner.phone.formatted}}</small>
                              <small class="mx-3"><strong>Documento: </strong> {{owner.document}}</small>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <h4>Anotações:</h4>
                  <h5 class="mb-0" v-html="customer.annotation"></h5>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import {GET, DELETE} from "@/store/modules/employee/employee-const";

  import {notifyVue, notifyError} from "@/utils";

  import Loading from '@/components/App/Loading'

  export default {
    name: 'show',
    components: {
      Loading
    },
    props: {
      id: {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState('customer', {
        loading: state => state.loading,
        customer: state => state.customer
      })
    },
    async created() {
      this.GET(this.id);
    },
    methods: {
      ...mapActions('customer', [GET, DELETE]),
      destroy() {
        this.DELETE(this.customer)
          .then(res => {
            notifyVue(this.$notify, 'O cliente foi apagado!', 'success');
            this.$router.push({name: 'customer.index'})
          }).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
