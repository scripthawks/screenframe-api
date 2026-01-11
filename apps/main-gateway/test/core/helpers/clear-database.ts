import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function clearDatabase(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(`
  TRUNCATE TABLE
  "users",
  "email_confirmations",  
  "password_recovery",
  "sessions"
  RESTART IDENTITY CASCADE
  `);
}
