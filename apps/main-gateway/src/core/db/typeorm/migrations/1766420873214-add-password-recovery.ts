import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordRecovery1766420873214 implements MigrationInterface {
  name = 'AddPasswordRecovery1766420873214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "password_recovery"
                                 (
                                   "created_at"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                   "updated_at"     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                   "deleted_at"     TIMESTAMP WITH TIME ZONE,
                                   "id"             uuid                     NOT NULL DEFAULT uuid_generate_v4(),
                                   "user_id"        uuid                     NOT NULL,
                                   "recovery_token" uuid                     NOT NULL,
                                   "expires_at"     TIMESTAMP WITH TIME ZONE NOT NULL,
                                   "is_used"        boolean                  NOT NULL DEFAULT false,
                                   CONSTRAINT "REL_d150be562deac1f539cc4b59fc" UNIQUE ("user_id"),
                                   CONSTRAINT "PK_104b7650227e31deb0f4c9e7d4b" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(
      `ALTER TABLE "password_recovery" ADD CONSTRAINT "FK_d150be562deac1f539cc4b59fc4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_recovery" DROP CONSTRAINT "FK_d150be562deac1f539cc4b59fc4"`,
    );
    await queryRunner.query(`DROP TABLE "password_recovery"`);
  }
}
