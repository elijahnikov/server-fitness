import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1648745175263 implements MigrationInterface {
    name = 'Initial1648745175263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_invites" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "groupId" integer NOT NULL, "userMemberId" integer NOT NULL, CONSTRAINT "PK_ca736add48a2a0f2f7950e4ac9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saved_food" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "serving" integer NOT NULL, "calories" integer NOT NULL, "protein" integer NOT NULL, "pictureUrl" character varying, "carbs" integer NOT NULL, "fat" integer NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_17ca43d2bdb577cb7bc3d49923a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workout_diary" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "weight" integer, "duration" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "workoutId" integer NOT NULL, CONSTRAINT "PK_c286964f3723f2a9776d81f724c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saved_workout" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "sets" character varying, "reps" character varying, "weight" integer, "duration" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "workoutDiaryId" integer, CONSTRAINT "PK_c5cde24c6bda4c426aa47312700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "type" character varying NOT NULL, "day" character varying NOT NULL, "duration" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "weight_history" ("id" SERIAL NOT NULL, "weight" integer NOT NULL, "previousWeight" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_a5697ac8bfdda68bc5e37d25297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "displayName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "currentWeight" integer, "goalWeight" integer, "heightFeet" integer, "heightInches" integer, "age" integer, "gender" character varying, "activityLevel" character varying, "calorieTarget" integer, "totalWorkoutsLogged" integer DEFAULT '0', "totalMealsLogged" integer DEFAULT '0', "totalWorkoutsSaved" integer DEFAULT '0', "totalMealsSaved" integer DEFAULT '0', "totalActivitiesScheduled" integer DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_members" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "groupId" integer NOT NULL, "userMemberId" integer NOT NULL, "isOwner" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_86446139b2c96bfd0f3b8638852" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_activity" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "foodDiaryId" integer, "workoutDiaryId" integer, "weightHistoryId" integer, "groupId" integer NOT NULL, CONSTRAINT "PK_50179385ba8181cea2cd9fed1af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "food_diary" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "calorieTarget" integer NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "foodId" integer NOT NULL, CONSTRAINT "PK_8a890facb20ea4eec096662e37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_invites" ADD CONSTRAINT "FK_a19036d19bd85c157b035d78c8a" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_food" ADD CONSTRAINT "FK_2a605ab6cd8261195f85715cba7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workout_diary" ADD CONSTRAINT "FK_0378717797e503083ed4409d421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_workout" ADD CONSTRAINT "FK_e11f8d5a976dbac01f813c686b0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_workout" ADD CONSTRAINT "FK_7c4624a86e33ee310b38b970c5f" FOREIGN KEY ("workoutDiaryId") REFERENCES "workout_diary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "schedule" ADD CONSTRAINT "FK_d796103491cf0bae197dda59477" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weight_history" ADD CONSTRAINT "FK_600c2227a527c12783a2de057d2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_members" ADD CONSTRAINT "FK_1aa8d31831c3126947e7a713c2b" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_activity" ADD CONSTRAINT "FK_67c1a80206e87177f9d158df9cb" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_activity" ADD CONSTRAINT "FK_10bc50d94d680e2da672d7fbccb" FOREIGN KEY ("foodDiaryId") REFERENCES "food_diary"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_activity" ADD CONSTRAINT "FK_3d71c29424b3b296c4be2c9c82e" FOREIGN KEY ("workoutDiaryId") REFERENCES "workout_diary"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_activity" ADD CONSTRAINT "FK_1e46416a9ab38fc633417cd1550" FOREIGN KEY ("weightHistoryId") REFERENCES "weight_history"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_activity" ADD CONSTRAINT "FK_823c8a2b8a24dd4d6cbb5eec1e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "food_diary" ADD CONSTRAINT "FK_225a70f0147bae5b56ad85bed9b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "food_diary" DROP CONSTRAINT "FK_225a70f0147bae5b56ad85bed9b"`);
        await queryRunner.query(`ALTER TABLE "group_activity" DROP CONSTRAINT "FK_823c8a2b8a24dd4d6cbb5eec1e6"`);
        await queryRunner.query(`ALTER TABLE "group_activity" DROP CONSTRAINT "FK_1e46416a9ab38fc633417cd1550"`);
        await queryRunner.query(`ALTER TABLE "group_activity" DROP CONSTRAINT "FK_3d71c29424b3b296c4be2c9c82e"`);
        await queryRunner.query(`ALTER TABLE "group_activity" DROP CONSTRAINT "FK_10bc50d94d680e2da672d7fbccb"`);
        await queryRunner.query(`ALTER TABLE "group_activity" DROP CONSTRAINT "FK_67c1a80206e87177f9d158df9cb"`);
        await queryRunner.query(`ALTER TABLE "group_members" DROP CONSTRAINT "FK_1aa8d31831c3126947e7a713c2b"`);
        await queryRunner.query(`ALTER TABLE "weight_history" DROP CONSTRAINT "FK_600c2227a527c12783a2de057d2"`);
        await queryRunner.query(`ALTER TABLE "schedule" DROP CONSTRAINT "FK_d796103491cf0bae197dda59477"`);
        await queryRunner.query(`ALTER TABLE "saved_workout" DROP CONSTRAINT "FK_7c4624a86e33ee310b38b970c5f"`);
        await queryRunner.query(`ALTER TABLE "saved_workout" DROP CONSTRAINT "FK_e11f8d5a976dbac01f813c686b0"`);
        await queryRunner.query(`ALTER TABLE "workout_diary" DROP CONSTRAINT "FK_0378717797e503083ed4409d421"`);
        await queryRunner.query(`ALTER TABLE "saved_food" DROP CONSTRAINT "FK_2a605ab6cd8261195f85715cba7"`);
        await queryRunner.query(`ALTER TABLE "group_invites" DROP CONSTRAINT "FK_a19036d19bd85c157b035d78c8a"`);
        await queryRunner.query(`DROP TABLE "food_diary"`);
        await queryRunner.query(`DROP TABLE "group_activity"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "group_members"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "weight_history"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TABLE "saved_workout"`);
        await queryRunner.query(`DROP TABLE "workout_diary"`);
        await queryRunner.query(`DROP TABLE "saved_food"`);
        await queryRunner.query(`DROP TABLE "group_invites"`);
    }

}
