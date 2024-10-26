import { Type } from '@nestjs/common';
import { TIPOS_AUTORIZACION } from '../constants';

export const TRANSACCION_MANAGERS = new Map<TIPOS_AUTORIZACION, Type>();

export function TransaccionManagerDecorator(value: TIPOS_AUTORIZACION) {
  return function (target) {
    if (TRANSACCION_MANAGERS.has(value)) {
      throw new Error(`Ya hay un manager asociado al tipo ${value}`);
    }

    TRANSACCION_MANAGERS.set(value, target);
  };
}
