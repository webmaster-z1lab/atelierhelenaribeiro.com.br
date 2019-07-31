<template>
  <div class="row">
    <mask-input class="col-3" placeholder="00000-000" name="postal_code" label="CEP" v-model="code" mask="#####-###"
                :error="getError('postal_code')" :valid="isValid('postal_code')" v-validate="'required|cep'" required/>

    <base-input class="col-5" placeholder="Nome da Rua" name="street" label="Logradouro" :error="getError('street')"
                :valid="isValid('street')" v-model="address.street" v-validate="'required'" required/>

    <base-input class="col-4" placeholder="Nome do Bairro" name="district" label="Bairro" v-model="address.district"
                :error="getError('district')" :valid="isValid('district')" v-validate="'required'"/>

    <base-input class="col-4" name="city" label="Cidade" :value="address.city" disabled/>

    <base-input class="col-2" name="state" label="Estado" :value="address.state" disabled/>

    <base-input class="col-2" type="number" name="number" label="Número" v-model="address.number"
                :error="getError('number')" :valid="isValid('number')" v-validate="'required|numeric'" required/>

    <base-input class="col-4" name="complement" label="Complemento" v-model="address.complement"
                :error="getError('complement')" :valid="isValid('complement')" v-validate="'required'" required/>
  </div>
</template>

<script>
  import MaskInput from './Inputs/Mask';

  import {ibge} from "@/services";
  import {notifyError} from "@/utils";
  import {isUndefined} from 'lodash';

  export default {
    name: "address-inputs",
    components: {
      MaskInput,
    },
    props: {
      address: {
        type: [Array, Object],
        required: true
      }
    },
    data() {
      return {
        validated: false,
        code: this.address.postal_code
      }
    },
    watch: {
      async code(value) {
        if (value.length === 8) {
          this.$emit('loading')

          await ibge.getCEP(value)
            .then(response => {
              if (isUndefined(response.data.erro)) {

                this.address.postal_code = value
                this.address.state = response.data.uf
                this.address.district = response.data.bairro
                this.address.city = response.data.localidade
                this.address.street = response.data.logradouro
                this.address.number = ''
                this.address.complement = ''

              } else {
                notifyError({error: {response: {data: {message: 'O Código Postal não foi encontrado ou não existe!'}}}})
              }
            })
            .catch(error => notifyError(error))
            .finally(() => this.$emit('loading'))
        }
      }
    },
    methods: {
      getError(name) {
        return this.errors.first(name);
      },
      isValid(name) {
        return this.validated && !this.errors.has(name);
      }
    }
  }
</script>
