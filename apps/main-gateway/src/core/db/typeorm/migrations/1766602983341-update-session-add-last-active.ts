import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSessionAddLastActive1766602983341 implements MigrationInterface {
    name = 'UpdateSessionAddLastActive1766602983341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "last_active" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "last_active"`);
    }

}
