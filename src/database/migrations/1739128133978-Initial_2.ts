import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial21739128133978 implements MigrationInterface {
  name = 'Initial21739128133978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."interactions_type_enum" RENAME TO "interactions_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interactions_type_enum" AS ENUM('LIKE', 'DISLIKE', 'SUPERLIKE', 'REPORT', 'BLOCKED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "interactions" ALTER COLUMN "type" TYPE "public"."interactions_type_enum" USING "type"::"text"::"public"."interactions_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."interactions_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."interactions_type_enum_old" AS ENUM('LIKE', 'DISLIKE', 'SUPERLIKE', 'REPORT')`,
    );
    await queryRunner.query(
      `ALTER TABLE "interactions" ALTER COLUMN "type" TYPE "public"."interactions_type_enum_old" USING "type"::"text"::"public"."interactions_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."interactions_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."interactions_type_enum_old" RENAME TO "interactions_type_enum"`,
    );
  }
}
