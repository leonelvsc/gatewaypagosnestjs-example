import { Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import * as schema_payment from './payment.schema.json';
import { JsonSchemaValidationPipe } from '../../pipes/json-schema-validation.pipe';
import { TransaccionService } from '../../services/transaccion/transaccion.service';

@Controller()
export class PaymentController {
  constructor(private transaccionService: TransaccionService) {}

  @Post()
  @UsePipes(new JsonSchemaValidationPipe(schema_payment))
  @HttpCode(200)
  async postAction() {
    return await this.transaccionService.cobrar();
  }
}
