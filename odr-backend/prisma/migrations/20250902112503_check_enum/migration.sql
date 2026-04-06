/*
  Warnings:

  - The `invitestatus` column on the `IdeaCollabInviteStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."IdeaCollabInviteStatus" DROP COLUMN "invitestatus",
ADD COLUMN     "invitestatus" TEXT NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "public"."InviteStatus";
