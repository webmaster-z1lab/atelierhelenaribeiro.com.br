<template>
  <div class="form-group">
    <slot name="label">
      <label v-if="label" :class="labelClasses">
        {{label}}
      </label>
    </slot>
    <div :class="[
       {'input-group': hasIcon},
       {'focused': focused},
       {'has-label': label || $slots.label}
    ]">
      <div v-if="prependIcon || $slots.prepend" class="input-group-prepend">
        <span class="input-group-text">
          <slot name="prepend">
            <i :class="prependIcon"></i>
          </slot>
        </span>
      </div>
      <slot>
        <the-mask class="form-control" v-model="code" :type="type" :valid="!errors.first(name)" :mask="mask" :masked="masked" v-bind="$attrs" :name="name"
                  :class="[{'is-valid': this.errors.has(name) === true}, {'is-invalid': errors.first(name)}, inputClasses]" v-validate="validate"/>
      </slot>
      <div v-if="appendIcon || $slots.append" class="input-group-append">
          <span class="input-group-text">
              <slot name="append">
                  <i :class="appendIcon"></i>
              </slot>
          </span>
      </div>
      <slot name="error">
        <div v-if="errors.first(name)" class="invalid-feedback" style="display: block;">
          {{ errors.first(name) }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import {TheMask} from 'vue-the-mask'

  export default {
    name: "mask-input",
    inject: ['$validator'],
    inheritAttrs: false,
    components: {
      TheMask,
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      validate: {
        type: String,
        default: ''
      },
      mask: {
        type: [String, Array],
        description: 'Type of mask to use, following the package vue-the-mask doc',
        default: ''
      },
      masked: {
        type: Boolean,
        description: 'Emit value with mask chars, default is raw',
        default: false
      },
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      successMessage: {
        type: String,
        description: "Input success message",
        default: 'Looks good!'
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
        default: "text"
      },
      appendIcon: {
        type: String,
        description: "Append icon (right)"
      },
      prependIcon: {
        type: String,
        description: "Prepend icon (left)"
      }
    },
    data() {
      return {
        code: this.value,
        focused: false
      };
    },
    watch: {
      code(value) {
        this.$emit('input', value)
      }
    },
    computed: {
      hasIcon() {
        const { append, prepend } = this.$slots;
        return (
          append !== undefined ||
          prepend !== undefined ||
          this.appendIcon !== undefined ||
          this.prependIcon !== undefined
        );
      }
    }
  };
</script>
<style>
</style>
