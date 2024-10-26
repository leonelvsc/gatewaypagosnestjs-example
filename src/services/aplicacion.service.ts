import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";

const CACHE_PREFIX = 'aplicacion';

@Injectable()
export class AplicacionService {
  constructor(
    private databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async traer(unToken: string) {
    const cacheKey = this.buildCacheKey(unToken);

    let aplicacion = await this.cacheManager.get(cacheKey);

    if (aplicacion) {
      return aplicacion;
    }

    const results = await this.databaseService.executeSql(
      `
      select
        *
      from
        empresa_aplicacion ec
      where
        ec.token = $1
    `,
      [unToken],
    );

    if (results) {
      aplicacion = results[0];
      await this.cacheManager.set(cacheKey, aplicacion, 3600 * 24);
    }

    return aplicacion;
  }

  private buildCacheKey(aKey: string) {
    return `${CACHE_PREFIX}_${aKey}`;
  }
}
