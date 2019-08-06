<template>
  <div class="form-group">
    <slot name="label">
      <label :class="labelClasses">
        {{changeLabel + label}}
      </label>
    </slot>
    <div class="input-group" :class="[{'has-label': label || $slots.label}]">
      <div class="input-group-prepend">
        <span class="input-group-text">
          <i :class="changeIcon"></i>
        </span>
      </div>
      <slot>
        <the-mask class="form-control" placeholder="(00) 00000-0000" :type="type" :mask="['(##) #####-####', '(##) ####-####']" :name="name" v-validate="'required|phone'"
                  :masked="masked" v-bind="$attrs" v-model="phone.number" :class="[{'is-valid': isValid(name)}, {'is-invalid': getError(name)}, inputClasses]" v-if="validate"/>
        <the-mask class="form-control" placeholder="(00) 00000-0000" :type="type" :mask="['(##) #####-####', '(##) ####-####']"
                  :masked="masked" v-bind="$attrs" v-model="phone.number" :class="inputClasses" v-else/>
      </slot>
      <div class="input-group-append">
        <el-tooltip content="Mudar Tipo" placement="top">
          <base-button type="primary" @click="changeType" size="sm">
            <i class="fas fa-retweet fa-lg"></i>
          </base-button>
        </el-tooltip>
      </div>
      <slot name="error">
        <div v-if="getError(name)" class="invalid-feedback" style="display: block;">
          {{ getError(name) }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import {TheMask} from 'vue-the-mask'

  export default {
    name: "phone-input",
    inheritAttrs: false,
    inject: ['$validator'],
    components: {
      TheMask,
    },
    props: {
      phone: {
        type: [Array, Object]
      },
      masked: {
        type: Boolean,
        description: 'Emit value with mask chars, default is raw',
        default: false
      },
      name: {
        type: String,
        default: ''
      },
      validate: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        description: "Input label (text before input)",
        default: ''
      },
      labelClasses: {
        type: String,
        description: "Input label css classes",
        default: "form-control-label"
      },
      inputClasses: {
        type: String,
        description: "Input css classes"
      },
      value: {
        type: [String, Number],
        description: "Input value",
        default: ''
      },
      type: {
        type: String,
        description: "Input type",
        default: "tel"
      },
    },
    data() {
      return {
        is_whatsapp: this.phone.is_whatsapp
      };
    },
    watch: {
      is_whatsapp(value) {
        this.phone.is_whatsapp = value
      }
    },
    computed: {
      changeIcon() {
        return this.is_whatsapp ? 'fab fa-whatsapp fa-lg' : 'fas fa-phone'
      },
      changeLabel() {
        return this.is_whatsapp ? 'Whatsapp' : 'Telefone'
      }
    },
    methods: {
      getError(name) {
        return this.errors.first(name);
      },
      isValid(name) {
        return !this.errors.has(name);
      },
      changeType() {
        this.is_whatsapp = !this.is_whatsapp
      }
    }
  };
</script>
<style>
</style>
