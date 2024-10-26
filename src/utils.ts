import crypto from 'node:crypto';

export function objHash(obj: any) {
  return crypto
    .createHash('sha512')
    .update(JSON.stringify(obj), 'utf8')
    .digest('hex');
}
