-- DropIndex
DROP INDEX "Board_id_key";

-- AlterTable
CREATE SEQUENCE board_id_seq;
ALTER TABLE "Board" ALTER COLUMN "id" SET DEFAULT nextval('board_id_seq');
ALTER SEQUENCE board_id_seq OWNED BY "Board"."id";
