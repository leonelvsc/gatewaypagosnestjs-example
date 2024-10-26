import { TransaccionManagerDecorator } from '../decorators/transaccion-manager.decorator';
import { Injectable, Scope } from '@nestjs/common';
import { TransaccionManagerInterface } from '../interfaces/transaccion-manager.interface';
import { FastifyRequestWithUser } from '../../../request/fastify-request-with-user';
import { TIPOS_AUTORIZACION } from '../constants';

@Injectable({ scope: Scope.REQUEST })
@TransaccionManagerDecorator(TIPOS_AUTORIZACION.MERCADOPAGO)
export class MercadopagoManager implements TransaccionManagerInterface {
  request: FastifyRequestWithUser;

  constructor() {}
}
