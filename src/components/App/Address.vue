<template>
  <div>
    <div class="form-row">
      <div class="col-lg-3">
        <mask-input placeholder="00000-000" name="postal_code" label="CEP" v-model="code" mask="#####-###"
                    :error="getError('postal_code')" :valid="isValid('postal_code')" v-validate="'required|cep'"/>
      </div>
      <div class="col-lg-5">
        <base-input placeholder="Nome da Rua" name="street" label="Logradouro" :error="getError('street')"
                    :valid="isValid('street')" v-model="address.street" v-validate="'required'"/>
      </div>
      <div class="col-lg-4">
        <base-input placeholder="Nome do Bairro" name="district" label="Bairro" v-model="address.district"
                    :error="getError('district')" :valid="isValid('district')" v-validate="'required'"/>
      </div>
    </div>
    <div class="form-row">
      <div class="col-lg-4">
        <base-input name="city" label="Cidade" :value="address.city" disabled/>
      </div>
      <div class="col-lg-2">
        <base-input name="state" label="Estado" :value="address.state" disabled/>
      </div>
      <div class="col-lg-2">
        <base-input type="number" name="number" label="Número" v-model="address.number" placeholder="00"
                    :error="getError('number')" :valid="isValid('number')" v-validate="'required|numeric'"/>
      </div>
      <div class="col-lg-4">
        <base-input name="complement" label="Complemento" v-model="address.complement" placeholder="Ap. 000"
                    :error="getError('complement')" :valid="isValid('complement')"/>
      </div>
    </div>
  </div>
</template>

<script>
  import MaskInput from './Inputs/Mask';

  import {ibge} from "@/services";
  import {notifyError} from "@/utils";
  import {isUndefined} from 'lodash';

  export default {
    name: "address-inputs",
    inject: ['$validator'],
    components: {
      MaskInput,
    },
    props: {
      address: {
        type: [Array, Object]
      }
    },
    data() {
      return {
        code: this.address.postal_code
      }
    },
    watch: {
      async code(value) {
        if (value.length === 8) {
          this.$emit('loading');

          await ibge.getCEP(value)
            .then(response => {
              if (isUndefined(response.data.erro)) {

                this.address.postal_code = value;
                this.address.state = response.data.uf;
                this.address.district = response.data.bairro;
                this.address.city = response.data.localidade;
                this.address.street = response.data.logradouro;
                this.address.number = '';
                this.address.complement = '';

              } else {
                notifyError({error: {response: {data: {message: 'O Código Postal não foi encontrado ou não existe!'}}}});
              }
            })
            .catch(error => notifyError(error))
            .finally(() => this.$emit('loading'));
        }
      }
    },
    methods: {
      getError(name) {
        return this.errors.first(name);
      },
      isValid(name) {
        return !this.errors.has(name);
      }
    }
  }
</script>
