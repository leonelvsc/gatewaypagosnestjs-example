import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { AplicacionService } from '../aplicacion.service';
import { TRANSACCION_MANAGERS } from './decorators/transaccion-manager.decorator';
import { ModuleRef, REQUEST } from '@nestjs/core';
import { TransaccionManagerInterface } from './interfaces/transaccion-manager.interface';
import { FastifyRequestWithUser } from '../../request/fastify-request-with-user';

@Injectable({ scope: Scope.REQUEST })
export class TransaccionService {
  constructor(
    private aplicacionService: AplicacionService,
    private moduleRef: ModuleRef,
    @Inject(REQUEST) private request: FastifyRequestWithUser,
  ) {}

  async cobrar() {
    const managerType = (this.request.body as any).hola;
    const manager = TRANSACCION_MANAGERS.get(managerType);

    if (!manager) {
      throw new BadRequestException(
        `No hay un manager para el tipo de gateway ${managerType}`,
      );
    }

    const managerInstance =
      await this.moduleRef.resolve<TransaccionManagerInterface>(manager);
    managerInstance.request = this.request;

    return {
      user: this.request.user,
      managerInstance: managerInstance.request.user,
      body: this.request.body,
    };
  }
}
