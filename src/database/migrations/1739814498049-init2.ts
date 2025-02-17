import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init21739814498049 implements MigrationInterface {
  name = 'Init21739814498049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD "profileId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "UQ_26fc47c1ab316bf1b89da56b476" UNIQUE ("profileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD "userPreferencesId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "UQ_c441b73c6cb818434bd8abeab4b" UNIQUE ("userPreferencesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "FK_26fc47c1ab316bf1b89da56b476" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_c441b73c6cb818434bd8abeab4b" FOREIGN KEY ("userPreferencesId") REFERENCES "user-preference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_c441b73c6cb818434bd8abeab4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "FK_26fc47c1ab316bf1b89da56b476"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "UQ_c441b73c6cb818434bd8abeab4b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP COLUMN "userPreferencesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "UQ_26fc47c1ab316bf1b89da56b476"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP COLUMN "profileId"`,
    );
  }
}
