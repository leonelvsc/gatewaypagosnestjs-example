import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private dataSource: DataSource) {}

  async executeSql(sql: string, params: any[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();

      return await queryRunner.manager.query(sql, params);
    } finally {
      await queryRunner.release();
    }
  }
}
