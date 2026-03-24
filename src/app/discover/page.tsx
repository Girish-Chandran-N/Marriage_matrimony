import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SwipeStack } from "@/components/SwipeStack";
import { SwipeProfile } from "@/components/SwipeableCard";

export default async function DiscoverPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Find users that the current user hasn't swiped on yet
  const users = await db.user.findMany({
    where: {
      id: { not: session.user.id },
      role: "USER",
      status: "ACTIVE",
      receivedInterests: {
        none: { senderId: session.user.id }
      },
      receivedBlocks: {
        none: { blockerId: session.user.id }
      }
    },
    include: {
      personalDetails: true,
      careerProfile: true
    },
    take: 10
  });

  const profiles: SwipeProfile[] = users.map((u) => ({
    id: u.id,
    name: u.name || "Unknown",
    image: u.profileImage || `https://i.pravatar.cc/300?u=${u.id}`,
    age: u.personalDetails?.dateOfBirth ? new Date().getFullYear() - u.personalDetails.dateOfBirth.getFullYear() : 25,
    profession: u.careerProfile?.currentStatus || u.careerProfile?.jobTitle || "Professional",
    datingIntent: u.personalDetails?.datingIntent || "Serious for marriage",
    familyInvolvement: u.personalDetails?.familyInvolvement || "Family involved",
    compatibilityScore: Math.floor(Math.random() * 30) + 70 // 70 to 99 mock score
  }));

  return (
    <div className="bg-[#09090b] h-[calc(100vh-70px)] sm:h-[calc(100vh-80px)] overflow-hidden flex flex-col pt-4">
      {/* Top Header - Premly Logo or Matrimony Badge */}
      <div className="flex justify-between items-center px-6 mb-2">
         <h1 className="text-2xl font-black text-rose-500 tracking-tight">Premly</h1>
         <div className="flex bg-[#1f1f23] rounded-full px-3 py-1 items-center gap-1.5 border border-[#333]">
           <span className="text-xs">💎</span>
           <span className="text-white text-xs font-bold tracking-wide">Matrimony</span>
         </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center px-4 overflow-hidden w-full max-w-lg mx-auto">
        <SwipeStack initialProfiles={profiles} />
      </div>
    </div>
  );
}
