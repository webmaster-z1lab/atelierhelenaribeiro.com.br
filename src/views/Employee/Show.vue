<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6">
      <card class="no-border-card" body-classes="px-0 pb-1" footer-classes="pb-2">
        <div slot="header">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{employee.name}}</h3>
              <p class="text-sm mb-0">
                Informações específicas do funcionário selecionado.
              </p>
            </div>
            <div class="col-6 text-right">
              <router-link :to="{name: 'employee.index'}" class="btn btn-icon btn-fab btn-sm btn-secondary">
                <span class="btn-inner--icon"><i class="fas fa-arrow-left"></i></span>
                <span class="btn-inner--text">Voltar</span>
              </router-link>
              <el-tooltip content="Editar Funcionário" placement="top">
                <router-link :to="{name: 'employee.edit', params: {id: id}}" class="btn btn-icon btn-fab btn-sm btn-warning">
                  <span class="btn-inner--icon"><i class="fas fa-user-edit"></i></span>
                  <span class="btn-inner--text">Editar</span>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Apagar Funcionário" placement="top">
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
              <h6 class="heading-small text-muted mb-4">Informações do Funcionário</h6>

              <div class="row align-items-center">
                <div class="col-12 mb-4">
                  <h4>Nome:</h4>
                  <h5 class="mb-0">{{employee.name}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Email:</h4>
                  <h5 class="mb-0">{{employee.email}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>CPF:</h4>
                  <h5 class="mb-0">{{employee.document}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Data de Nascimento:</h4>
                  <h5 class="mb-0">{{employee.birth_date}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Data de Admissão:</h4>
                  <h5 class="mb-0">{{employee.admission_date}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Identidade:</h4>
                  <h5 class="mb-0">{{employee.identity}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Carteira de Trabalho:</h4>
                  <h5 class="mb-0">{{employee.work_card}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Remuneração:</h4>
                  <h5 class="mb-0">{{employee.remuneration}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Telefone:</h4>
                  <h5 class="mb-0">
                    <i :class="employee.phone.is_whatsapp ? 'fab fa-whatsapp mr-1' : 'fas fa-phone mr-1'"></i> {{employee.phone.formatted}}
                  </h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Tipo:</h4>
                  <h5 class="mb-0">{{employee.type}}</h5>
                </div>
                <div class="col-12 mb-4">
                  <h4>Endereço:</h4>
                  <h5 class="mb-0">{{employee.address.formatted}}</h5>
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
      ...mapState('employee', {
        loading: state => state.loading,
        employee: state => state.employee
      })
    },
    async created() {
      this.GET(this.id);
    },
    methods: {
      ...mapActions('employee', [GET, DELETE]),
      destroy() {
        this.DELETE(this.employee)
          .then(res => {
            notifyVue(this.$notify, 'O funcionário foi apagado!', 'success')
            this.$router.push({name: 'employee.index'})
          }).catch(error => notifyError(this.$notify, error));
      }
    }
  };
</script>
