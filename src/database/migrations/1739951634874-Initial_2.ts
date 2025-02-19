import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial21739951634874 implements MigrationInterface {
  name = 'Initial21739951634874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "FK_26fc47c1ab316bf1b89da56b476"`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "messageContent" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'sent', "readAt" TIMESTAMP, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "REL_26fc47c1ab316bf1b89da56b47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP COLUMN "profileId"`,
    );
    await queryRunner.query(`ALTER TABLE "profiles" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`,
    );
    await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD "profileId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "REL_26fc47c1ab316bf1b89da56b47" UNIQUE ("profileId")`,
    );
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "FK_26fc47c1ab316bf1b89da56b476" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
