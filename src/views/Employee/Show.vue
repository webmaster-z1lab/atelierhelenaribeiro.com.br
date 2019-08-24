<template>
  <div class="content">
    <loading :loading="loading" :is-full-page="false"/>

    <base-header-app/>

    <div class="container-fluid mt--6" v-if="employee">
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

<style>
  .no-border-card .card-footer{
    border-top: 0;
  }
</style>

<script>
  import Employee from '@/models/Employee'

  import {notifyVue, notifyError} from "@/utils";
  import swal from 'sweetalert2';

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
    data: () => ({
      loading: true,
    }),
    computed: {
      employee() {
        return Employee.find(this.id)
      }
    },
    async created() {
      if (!this.employee) {
       await Employee.$get({params: {id: this.id}})
      }

      this.changeLoading()
    },
    methods: {
      changeLoading() {
        this.loading = !this.loading
      },
      destroy() {
        swal({
          title: 'Você tem Certeza?',
          text: `Ao fazer isso os dados não poderão ser recuperados!`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn btn-success btn-fill',
          cancelButtonClass: 'btn btn-danger btn-fill',
          confirmButtonText: 'Sim, apagar!',
          cancelButtonText: 'Cancelar',
          buttonsStyling: false
        }).then(async result => {
          if (result.value) {
            await this.changeLoading();

            await Employee.$delete({params: {id: this.id}})
              .then(response => {
                notifyVue(this.$notify, 'O funcionário foi apagado!', 'success');
                this.$router.push({name: 'employee.index'})
              })
              .catch(error => notifyError(this.$notify, error))

            this.changeLoading()
          }
        });
      }
    }
  };
</script>
