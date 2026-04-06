-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."InviteStatus" AS ENUM ('PENDING', 'ACCEPT', 'REJECT');

-- CreateTable
CREATE TABLE "public"."EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mailsubject" TEXT NOT NULL,
    "mailcontent" TEXT NOT NULL,
    "active_id" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Communication" (
    "id" TEXT NOT NULL,
    "msgContent" TEXT NOT NULL,
    "msgSubject" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',
    "messageId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IdeaCollabInviteStatus" (
    "id" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activity" BOOLEAN NOT NULL DEFAULT false,
    "invitestatus" "public"."InviteStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdeaCollabInviteStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "public"."EmailTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaCollabInviteStatus_ideaId_userId_key" ON "public"."IdeaCollabInviteStatus"("ideaId", "userId");

-- AddForeignKey
ALTER TABLE "public"."IdeaCollabInviteStatus" ADD CONSTRAINT "IdeaCollabInviteStatus_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "public"."Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IdeaCollabInviteStatus" ADD CONSTRAINT "IdeaCollabInviteStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
