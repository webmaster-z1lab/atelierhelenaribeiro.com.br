<template>
  <card>
    <div class="row justify-content-end">
      <div class="col-lg-4 mb-4">
        <base-button :type="component === 'payroll' ? 'default' : 'info'" size="lg" class="btn-block" @click="component = 'payroll'">Consignados</base-button>
      </div>
      <div class="col-lg-4 mb-4">
        <base-button :type="component === 'sale' ? 'default' : 'info'" size="lg" class="btn-block" @click="component = 'sale'">Venda</base-button>
      </div>
      <div class="col-lg-4 mb-4">
        <base-button :type="component === 'devolution' ? 'default' : 'info'" size="lg" class="btn-block" @click="component = 'devolution'">Devoluções</base-button>
      </div>

      <component :is="component" :packing="packing"/>
    </div>
  </card>
</template>

<script>
  import Sale from './Partials/Sale';
  import Payroll from './Partials/Payroll';
  import Devolution from './Partials/Devolution';

  import {mapState} from 'vuex';

  import {notifyVue, notifyError} from "@/utils";
  import { Select, Option, Table, TableColumn, Tooltip} from 'element-ui'
  import {http} from "@/services";
  import {isEmpty, sumBy} from 'lodash'

  export default {
    name: 'index',
    components: {
      Devolution,
      Payroll,
      Sale,
      [Select.name]: Select,
      [Option.name]: Option,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Tooltip.name]: Tooltip
    },
    data () {
      return {
        packing: {},
        component: 'payroll'
      }
    },
    computed: {
      ...mapState('visit', {
        visit: state => state.visit
      })
    },
    methods: {

    },
    async mounted() {
      await http.get('packings/current',  {seller: this.visit.seller.id}).then(response => this.packing = response.data).catch(error => console.dir(error));
    }
  };
</script>
