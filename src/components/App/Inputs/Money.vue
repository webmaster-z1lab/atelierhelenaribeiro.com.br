<template>
  <div class="form-group">
    <slot name="label">
      <label v-if="label" :class="labelClasses">
        {{label}}
      </label>
    </slot>
    <div :class="[
       {'input-group': hasIcon},
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
        <money class="form-control" v-model="code" :valid="!error"  v-bind="money" :class="[{'is-valid': valid === true}, {'is-invalid': error}, inputClasses]"/>
      </slot>
      <div v-if="appendIcon || $slots.append" class="input-group-append">
          <span class="input-group-text">
              <slot name="append">
                  <i :class="appendIcon"></i>
              </slot>
          </span>
      </div>
      <slot name="error">
        <div v-if="error" class="invalid-feedback" style="display: block;">
          {{ error }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
  import {Money} from 'v-money'

  export default {
    name: "money-input",
    components: {
      Money,
    },
    props: {
      valid: {
        type: Boolean,
        description: "Whether is valid",
        default: undefined
      },
      label: {
        type: String,
        description: "Input label (text before input)"
      },
      error: {
        type: String,
        description: "Input error (below input)"
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
        default: 0
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
        money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          suffix: '',
          precision: 2,
          masked: false
        },
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
