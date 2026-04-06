-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."IdeaSubmission" ADD COLUMN     "inviteCollaborators" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC';
