-- CreateTable
CREATE TABLE "VaultSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "chronicConditions" TEXT,
    "emergencyContact" TEXT,
    "insuranceDetails" TEXT,
    "notes" TEXT,
    "avatarColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MedicalEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "doctor" TEXT,
    "hospital" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalEvent_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "FamilyMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "memberId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "ocrText" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "MedicalEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Document_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "FamilyMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventTag" (
    "eventId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "tagId"),
    CONSTRAINT "EventTag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "MedicalEvent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EventTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocumentTag" (
    "documentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("documentId", "tagId"),
    CONSTRAINT "DocumentTag_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
