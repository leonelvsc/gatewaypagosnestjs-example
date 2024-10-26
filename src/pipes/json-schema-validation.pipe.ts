import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { AnySchema } from 'ajv';
import { JsonSchemaValidatorService } from '../services/json-schema-validator.service';
import { objHash } from '../utils';

@Injectable()
export class JsonSchemaValidationPipe implements PipeTransform {
  private readonly schemaKey: string;

  constructor(private schema: AnySchema) {
    this.schemaKey = objHash(schema);
    JsonSchemaValidatorService.addSchema(schema, this.schemaKey);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const res = await JsonSchemaValidatorService.validate(
      this.schemaKey,
      value,
    );
    if (!res.isValid) {
      throw new BadRequestException(res.errors, 'Estructura invalida');
    }
    return value;
  }
}
