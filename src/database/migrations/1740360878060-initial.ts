import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1740360878060 implements MigrationInterface {
  name = 'Initial1740360878060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isPublic" boolean NOT NULL DEFAULT true, "displayName" character varying NOT NULL, "age" integer NOT NULL, "gender" character varying NOT NULL, "sexualOrientation" text array NOT NULL, "bio" character varying, "location" character varying, "files" text array, "latitude" numeric(9,6), "longitude" numeric(9,6), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "REL_315ecd98bd1a42dcf2ec4e2e98" UNIQUE ("userId"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interactions_type_enum" AS ENUM('LIKE', 'DISLIKE', 'SUPERLIKE', 'REPORT', 'BLOCKED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "type" "public"."interactions_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_911b7416a6671b4148b18c18ecb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "potential_matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matchScore" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "potentialMatchId" uuid, CONSTRAINT "PK_44c1f0a1b31c9932e7de8a3cca7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "location" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user-preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "hobbies" text, "lookingFor" text, "languages" text, "zodiacSigns" text, "education" text, "futureFamily" text, "personalityTypes" text, "communicationStyles" text, "petPreferences" text, "drinking" text, "smoking" text, "exercise" text, "diet" text, "socialMedia" text, "sleepHabits" text, CONSTRAINT "REL_9bb77797d2f34f489301fc6989" UNIQUE ("userId"), CONSTRAINT "PK_2a44796cd34b7759c34fb3f711e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "matches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matchedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "matchedUserId" uuid, CONSTRAINT "UQ_67d8e929a0402f72c2b2dd08d6a" UNIQUE ("userId", "matchedUserId"), CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user1Id" uuid NOT NULL, "user2Id" uuid NOT NULL, "lastMessageId" uuid, CONSTRAINT "REL_c6e63680bca6085833f396ac1f" UNIQUE ("lastMessageId"), CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, "messageContent" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'sent', "readAt" TIMESTAMP, "conversationId" uuid NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "potential_matches" ADD CONSTRAINT "FK_05053a8f8eaa1012956c2a896a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "potential_matches" ADD CONSTRAINT "FK_ed54ead93850505867426f5e132" FOREIGN KEY ("potentialMatchId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" ADD CONSTRAINT "FK_9bb77797d2f34f489301fc69898" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_0e1f5006d52bcbc4936d2f18ace" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" ADD CONSTRAINT "FK_9a20c1064126b7440a1de7d4a33" FOREIGN KEY ("matchedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_5ecde0e8532667bde83d87ed0b4" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_47c90625a3eed92def079e1a78d" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_c6e63680bca6085833f396ac1fa" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_acf951a58e3b9611dd96ce89042" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_e5663ce0c730b2de83445e2fd19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_acf951a58e3b9611dd96ce89042"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_c6e63680bca6085833f396ac1fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_47c90625a3eed92def079e1a78d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_5ecde0e8532667bde83d87ed0b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_9a20c1064126b7440a1de7d4a33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "matches" DROP CONSTRAINT "FK_0e1f5006d52bcbc4936d2f18ace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-preference" DROP CONSTRAINT "FK_9bb77797d2f34f489301fc69898"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "potential_matches" DROP CONSTRAINT "FK_ed54ead93850505867426f5e132"`,
    );
    await queryRunner.query(
      `ALTER TABLE "potential_matches" DROP CONSTRAINT "FK_05053a8f8eaa1012956c2a896a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`,
    );
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "matches"`);
    await queryRunner.query(`DROP TABLE "user-preference"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "potential_matches"`);
    await queryRunner.query(`DROP TABLE "interactions"`);
    await queryRunner.query(`DROP TYPE "public"."interactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
