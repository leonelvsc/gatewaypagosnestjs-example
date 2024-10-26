import Ajv, { AnySchema, ErrorObject } from 'ajv';

const ajv = new Ajv();

interface ValidSchema {
  isValid: boolean;
  errors?: ErrorObject[];
}

export class JsonSchemaValidatorService {
  static addSchema(jsonSchema: AnySchema, key: string) {
    ajv.addSchema(jsonSchema, key);
  }

  static async validate(keySchema: string, value: any): Promise<ValidSchema> {
    const validate = ajv.getSchema(keySchema);
    return {
      isValid: !!(await validate(value)),
      errors: validate.errors,
    };
  }
}
