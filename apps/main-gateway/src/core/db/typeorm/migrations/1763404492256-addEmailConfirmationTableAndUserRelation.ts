import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailConfirmationTableAndUserRelation1763404492256 implements MigrationInterface {
    name = 'AddEmailConfirmationTableAndUserRelation1763404492256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmations" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "confirmation_token" character varying(500) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "is_used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_339f55fff5d51b12e0e612c1c7a" UNIQUE ("confirmation_token"), CONSTRAINT "REL_97c4781eabb13c92ea53f21d8f" UNIQUE ("user_id"), CONSTRAINT "PK_178b5599cd7e3ec9cfdfb144b50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_86db692506a6a7dcdd1145d9ab" ON "email_confirmations" ("expires_at") `);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP CONSTRAINT "FK_97c4781eabb13c92ea53f21d8f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_86db692506a6a7dcdd1145d9ab"`);
        await queryRunner.query(`DROP TABLE "email_confirmations"`);
    }

}
