import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Cluster } from './cluster';
import * as os from 'node:os';
import { AuthGuard } from './guards/auth.guard';
import { AplicacionService } from './services/aplicacion.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.useGlobalGuards(new AuthGuard(app.get(AplicacionService)));
  await app.listen(3000, '0.0.0.0');
}

if (process.env['ENV'] === 'DEV') {
  bootstrap();
} else {
  Cluster.register(os.cpus().length, bootstrap);
}
