import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AplicacionService } from '../services/aplicacion.service';
import { FastifyRequestWithUser } from '../request/fastify-request-with-user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private aplicacionService: AplicacionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException();
    }

    const parts = authHeader.split(' ');

    if (!(parts.length === 2 && parts[0] === 'Bearer')) {
      throw new UnauthorizedException();
    }

    request.user = await this.aplicacionService.traer(parts[1]);

    return !!request.user;
  }
}
