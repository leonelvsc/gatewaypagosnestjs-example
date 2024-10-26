import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaymentController } from './controllers/payment/payment.controller';
import { SubscriptionController } from './controllers/subscription/subscription.controller';
import { AplicacionService } from './services/aplicacion.service';
import { DatabaseService } from './services/database.service';
import { JsonSchemaValidatorService } from './services/json-schema-validator.service';
import { TransaccionService } from './services/transaccion/transaccion.service';
import fsStore from 'cache-manager-fs-hash';
import { MercadopagoManager } from './services/transaccion/managers/mercadopago-manager';
import { PaywayManager } from './services/transaccion/managers/payway-manager';
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: fsStore,
      max: 1000000,
    }),
    ConfigModule.forRoot({ cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_DB'),
          extra: {
            // based on  https://node-postgres.com/api/pool
            // max connection pool size
            max: 50,
          },
        };
      },
    }),
  ],
  controllers: [PaymentController, SubscriptionController],
  providers: [
    AplicacionService,
    DatabaseService,
    JsonSchemaValidatorService,
    TransaccionService,
    MercadopagoManager,
    PaywayManager,
  ],
})
export class AppModule {}
