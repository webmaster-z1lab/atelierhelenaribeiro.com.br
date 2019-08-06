import { Validator } from "vee-validate"
import { parse, isBefore} from 'date-fns';

import pt_BR from 'vee-validate/dist/locale/pt_BR'
Validator.localize('pt_BR', pt_BR)

import { ibge } from "@/services";
import {isNull, isUndefined} from 'lodash'

const phone = {
    getMessage(field, args, data) {
        return (data && data.message) || `O valor do campo ${field} não é válido.`
    },
    validate(value, args) {
        return !isNull(value.match(/^\d{10}(\d)?$/));
    }
};

const cep = {
    getMessage(field, args, data) {
        return (data && data.message) || `O valor do campo ${field} não é válido.`
    },
    async validate(value, args) {
        if (value.length === 8) {
            let valid = await ibge.getCEP(value)

            return isUndefined(valid.data.erro)
        }

        return false
    }
};

const cnpj = {
    getMessage(field, args, data) {
        return (data && data.message) || `O valor do campo ${field} não é válido.`;
    },
    validate(value, args) {
        return !isNull(value.match(/^\d{14}$/));
    }
};

const cpf = {
    getMessage(field, args, data) {
        return (data && data.message) || `O valor do campo ${field} não é válido.`;
    },
    validate(value, args) {
        return !isNull(value.match(/^\d{11}$/));
    }
};

const document = {
    getMessage(field, args, data) {
        return (data && data.message) || `O valor do campo ${field} não é válido.`;
    },
    validate(value, args) {
        return !isNull(value.match(/^\d{11}(\d{3})?$/))
    }
};

const beforeToday = {
  getMessage(field, args, data) {
    return (data && data.message) || `O valor do campo ${field} deve ser menor que o dia atual.`;
  },
  validate(value, args) {
    return isBefore(parse(value, 'dd/MM/yyyy', new Date()), new Date())
  }
};

Validator.extend('phone', phone);
Validator.extend('cep', cep);
Validator.extend('cnpj', cnpj);
Validator.extend('cpf', cpf);
Validator.extend('document', document);
Validator.extend('before_today', beforeToday);
