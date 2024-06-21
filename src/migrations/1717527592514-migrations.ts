import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1717527592514 implements MigrationInterface {
    name = 'Migrations1717527592514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contrato" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_modulo" uuid NOT NULL, "modulo_name" character varying NOT NULL, "modulo_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b82cfcedf2037eab18ca2714ef9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user-permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_contract" uuid NOT NULL, "id_user" uuid NOT NULL, "id_permission" character varying NOT NULL, "modulo_name" character varying NOT NULL, CONSTRAINT "UQ_032152a50896115b6b05dd41b27" UNIQUE ("id_contract", "id_user", "id_permission"), CONSTRAINT "PK_4c07e3bf3214aacd29e5da711d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-permission" ADD CONSTRAINT "FK_d5891169f2092fbff70fb1d9ded" FOREIGN KEY ("id_contract") REFERENCES "contrato"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-permission" DROP CONSTRAINT "FK_d5891169f2092fbff70fb1d9ded"`);
        await queryRunner.query(`DROP TABLE "user-permission"`);
        await queryRunner.query(`DROP TABLE "contrato"`);
    }

}
