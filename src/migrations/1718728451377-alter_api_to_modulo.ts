import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterApiToModulo1718728451377 implements MigrationInterface {
    name = 'AlterApiToModulo1718728451377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-permission" RENAME COLUMN "api_name" TO "modulo_name"`);
        await queryRunner.query(`ALTER TABLE "contrato" DROP COLUMN "api_name"`);
        await queryRunner.query(`ALTER TABLE "contrato" DROP COLUMN "api_active"`);
        await queryRunner.query(`ALTER TABLE "contrato" ADD "modulo_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contrato" ADD "modulo_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contrato" DROP COLUMN "modulo_active"`);
        await queryRunner.query(`ALTER TABLE "contrato" DROP COLUMN "modulo_name"`);
        await queryRunner.query(`ALTER TABLE "contrato" ADD "api_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "contrato" ADD "api_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user-permission" RENAME COLUMN "modulo_name" TO "api_name"`);
    }

}
