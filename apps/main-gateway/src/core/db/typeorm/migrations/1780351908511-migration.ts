import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1780351908511 implements MigrationInterface {
  name = 'Migration1780351908511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatar_url" character varying, "avatar_public_id" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" date, "country" character varying, "city" character varying, "about" character varying(200), "user_id" uuid, CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "author_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ALTER COLUMN "author_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "profiles"`);
  }
}
