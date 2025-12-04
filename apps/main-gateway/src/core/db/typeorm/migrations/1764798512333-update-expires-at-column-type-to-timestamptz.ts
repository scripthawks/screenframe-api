import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateExpiresAtColumnTypeToTimestamptz1764798512333
  implements MigrationInterface
{
  name = 'UpdateExpiresAtColumnTypeToTimestamptz1764798512333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_86db692506a6a7dcdd1145d9ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" DROP COLUMN "expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_86db692506a6a7dcdd1145d9ab" ON "email_confirmations" ("expires_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_86db692506a6a7dcdd1145d9ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" DROP COLUMN "expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmations" ADD "expires_at" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_86db692506a6a7dcdd1145d9ab" ON "email_confirmations" ("expires_at") `,
    );
  }
}
