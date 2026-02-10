-- CreateEnum for Interest Status
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable UserPhoto
CREATE TABLE "UserPhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isProfile" BOOLEAN NOT NULL DEFAULT false,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable Education
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "university" TEXT,
    "stream" TEXT,
    "passedYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable Job
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable Sibling
CREATE TABLE "Sibling" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "occupation" TEXT,
    "maritalStatus" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sibling_pkey" PRIMARY KEY ("id")
);

-- CreateTable Interest
CREATE TABLE "Interest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "InterestStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable Shortlist
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shortlistedUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable ProfileView
CREATE TABLE "ProfileView" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileView_pkey" PRIMARY KEY ("id")
);

-- CreateTable ContactView
CREATE TABLE "ContactView" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactView_pkey" PRIMARY KEY ("id")
);

-- AlterTable User
ALTER TABLE "User" 
ADD COLUMN "phoneNumber" TEXT;

-- AlterTable PersonalDetails
ALTER TABLE "PersonalDetails" 
DROP COLUMN IF EXISTS "city",
DROP COLUMN IF EXISTS "country",
DROP COLUMN IF EXISTS "district",
DROP COLUMN IF EXISTS "state",
ADD COLUMN "about" TEXT,
ADD COLUMN "communicationAddress" TEXT,
ADD COLUMN "custodianName" TEXT,
ADD COLUMN "custodianRelation" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "idProof" TEXT,
ADD COLUMN "leaveDateFrom" TIMESTAMP(3),
ADD COLUMN "leaveDateTo" TIMESTAMP(3),
ADD COLUMN "nationality" TEXT,
ADD COLUMN "nativeCity" TEXT,
ADD COLUMN "nativeCountry" TEXT,
ADD COLUMN "nativeDistrict" TEXT,
ADD COLUMN "nativeState" TEXT,
ADD COLUMN "physicalStatus" TEXT,
ADD COLUMN "preferredTime" TEXT,
ADD COLUMN "primaryContact" TEXT,
ADD COLUMN "referenceContact" TEXT,
ADD COLUMN "referenceName" TEXT,
ADD COLUMN "referenceRelation" TEXT,
ADD COLUMN "residingCity" TEXT,
ADD COLUMN "residingCountry" TEXT,
ADD COLUMN "residingDistrict" TEXT,
ADD COLUMN "residingState" TEXT,
ADD COLUMN "subCaste" TEXT,
ADD COLUMN "whatsapp" TEXT;

-- AlterTable CareerProfile
ALTER TABLE "CareerProfile"
ADD COLUMN "careerGoal" TEXT,
ADD COLUMN "currentStatus" TEXT,
ADD COLUMN "internshipCompany" TEXT,
ADD COLUMN "internshipDuration" TEXT,
ADD COLUMN "internshipRole" TEXT,
ALTER COLUMN "jobTitle" DROP NOT NULL,
ALTER COLUMN "companyName" DROP NOT NULL;

-- AlterTable FamilyDetails
ALTER TABLE "FamilyDetails"
ADD COLUMN "familyImages" TEXT[],
ADD COLUMN "familyIntro" TEXT,
ADD COLUMN "familyName" TEXT,
ADD COLUMN "familyValue" TEXT,
ADD COLUMN "fatherHouseName" TEXT,
ADD COLUMN "fatherName" TEXT,
ADD COLUMN "fatherNativePlace" TEXT,
ADD COLUMN "grandParentsDetails" TEXT,
ADD COLUMN "motherHouseName" TEXT,
ADD COLUMN "motherName" TEXT,
ADD COLUMN "motherNativePlace" TEXT,
ALTER COLUMN "brothers" DROP DEFAULT,
ALTER COLUMN "sisters" DROP DEFAULT;

-- AlterTable LifestyleDetails
ALTER TABLE "LifestyleDetails"
ADD COLUMN "adventureLevel" TEXT,
ADD COLUMN "blogger" TEXT,
ADD COLUMN "books" TEXT[],
ADD COLUMN "culturalBackground" TEXT,
ADD COLUMN "dressStyle" TEXT,
ADD COLUMN "drivingLicense" TEXT,
ADD COLUMN "eatingHabits" TEXT,
ADD COLUMN "facebook" TEXT,
ADD COLUMN "favoriteCuisine" TEXT,
ADD COLUMN "instagram" TEXT,
ADD COLUMN "learningInterest" TEXT,
ADD COLUMN "linkedin" TEXT,
ADD COLUMN "movies" TEXT[],
ADD COLUMN "music" TEXT[],
ADD COLUMN "otherSocial" TEXT,
ADD COLUMN "petPreference" TEXT,
ADD COLUMN "sports" TEXT[],
ADD COLUMN "tiktok" TEXT,
ADD COLUMN "travelFrequency" TEXT,
ADD COLUMN "weekendPreference" TEXT,
ADD COLUMN "youtube" TEXT;

-- AlterTable MatchPreferences
ALTER TABLE "MatchPreferences"
ADD COLUMN "bodyType" TEXT,
ADD COLUMN "complexion" TEXT,
ADD COLUMN "education" TEXT,
ADD COLUMN "employmentCategory" TEXT,
ADD COLUMN "expectations" TEXT,
ADD COLUMN "familyStatus" TEXT,
ADD COLUMN "incomeRange" TEXT,
ADD COLUMN "jobStatus" TEXT,
ADD COLUMN "otherReligions" TEXT[],
ADD COLUMN "physicalStatus" TEXT,
ADD COLUMN "readyToRelocate" TEXT,
ADD COLUMN "workingCountry" TEXT;

-- DropTable EducationDetails (if exists)
DROP TABLE IF EXISTS "EducationDetails";

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
CREATE UNIQUE INDEX "Interest_senderId_receiverId_key" ON "Interest"("senderId", "receiverId");
CREATE UNIQUE INDEX "Shortlist_userId_shortlistedUserId_key" ON "Shortlist"("userId", "shortlistedUserId");
CREATE UNIQUE INDEX "ContactView_viewerId_profileId_key" ON "ContactView"("viewerId", "profileId");

-- AddForeignKey
ALTER TABLE "UserPhoto" ADD CONSTRAINT "UserPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Sibling" ADD CONSTRAINT "Sibling_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_shortlistedUserId_fkey" FOREIGN KEY ("shortlistedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfileView" ADD CONSTRAINT "ProfileView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProfileView" ADD CONSTRAINT "ProfileView_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactView" ADD CONSTRAINT "ContactView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContactView" ADD CONSTRAINT "ContactView_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
