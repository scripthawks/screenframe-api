import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProvider1769600231240 implements MigrationInterface {
  name = 'AddProvider1769600231240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."providers_type_enum" AS ENUM(
                'google', 
                'github'
            )
        `);
    await queryRunner.query(
      `CREATE TABLE "providers" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."providers_type_enum" NOT NULL, "provider_account_id" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "providers" ADD CONSTRAINT "FK_842a46f6b0079a69520561eeb62" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "providers" DROP CONSTRAINT "FK_842a46f6b0079a69520561eeb62"`,
    );
    await queryRunner.query(`DROP TABLE "providers"`);
  }
}
