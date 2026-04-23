import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1776935452174 implements MigrationInterface {
  name = 'Migration1776935452174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sessions" DROP COLUMN "refresh_token"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."providers_type_enum" RENAME TO "providers_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."providers_type_enum" AS ENUM('GOOGLE', 'GIT_HUB')`,
    );
    await queryRunner.query(
      `ALTER TABLE "providers" ALTER COLUMN "type" TYPE "public"."providers_type_enum" USING "type"::"text"::"public"."providers_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."providers_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password")`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."providers_type_enum_old" AS ENUM('google', 'github')`,
    );
    await queryRunner.query(
      `ALTER TABLE "providers" ALTER COLUMN "type" TYPE "public"."providers_type_enum_old" USING "type"::"text"::"public"."providers_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."providers_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."providers_type_enum_old" RENAME TO "providers_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "sessions" ADD "refresh_token" text`);
  }
}
