import { getProfessionCounts } from "@/lib/user-actions";
import { getMatches, MatchFilters } from "@/lib/match-actions";
import { MatchCard } from "@/components/matches/match-card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AdPlacement from "@/components/ad-placement";
import ProfessionSearchFilters from "@/components/search/profession-search-filters";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfessionSearchPage({ searchParams }: PageProps) {
    // 1. Await Search Params (Fix for Next.js 15+)
    const resolvedParams = await searchParams;

    // 2. Get Categories & Counts for Dropdown
    const counts = await getProfessionCounts();

    // 3. Parse Filters
    const selectedCategory = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
    const ageMin = resolvedParams.ageMin ? Number(resolvedParams.ageMin) : undefined;
    const ageMax = resolvedParams.ageMax ? Number(resolvedParams.ageMax) : undefined;

    // Construct filters for backend
    const filters: MatchFilters = {
        employmentCategory: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
        ageMin,
        ageMax,
        // Preserve other filters if passed via URL manually, though UI only shows Profession/Age now
        minHeight: resolvedParams.minHeight ? Number(resolvedParams.minHeight) : undefined,
        maxHeight: resolvedParams.maxHeight ? Number(resolvedParams.maxHeight) : undefined,
        workingCountry: typeof resolvedParams.workingCountry === 'string' ? resolvedParams.workingCountry : undefined,
        workingState: typeof resolvedParams.workingState === 'string' ? resolvedParams.workingState : undefined,
        nativeCountry: typeof resolvedParams.nativeCountry === 'string' ? resolvedParams.nativeCountry : undefined,
        nativeState: typeof resolvedParams.nativeState === 'string' ? resolvedParams.nativeState : undefined,
        religion: typeof resolvedParams.religion === 'string' ? resolvedParams.religion : undefined,
        caste: typeof resolvedParams.caste === 'string' ? resolvedParams.caste : undefined,
    };

    // 4. Fetch Matches
    const matches = await getMatches(filters);

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Header & Filters */}
            <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Search by <span className="text-indigo-600">Profession</span>
                        </h1>

                        {/* Client Component for Dropdowns */}
                        <div className="flex-1 w-full md:w-auto flex justify-end">
                            <ProfessionSearchFilters
                                counts={counts}
                                currentCategory={selectedCategory || 'all'}
                                currentAgeMin={ageMin?.toString() || ''}
                                currentAgeMax={ageMax?.toString() || ''}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Width Grid */}
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8 flex gap-8">

                {/* Results - Expanded to fill more space */}
                <main className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-700">
                            {selectedCategory && selectedCategory !== 'all' ? `${selectedCategory} Matches` : "All Professional Profiles"}
                            <span className="text-slate-400 ml-2 text-sm font-normal">
                                ({Array.isArray(matches) ? matches.length : 0} found)
                            </span>
                        </h2>
                    </div>

                    {Array.isArray(matches) && matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {matches.map((match: any) => (
                                <MatchCard key={match.user.id} user={match.user} score={match.score} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-300">
                            <div className="text-6xl mb-4 grayscale opacity-50">📂</div>
                            <h3 className="text-xl font-bold text-slate-800">No profiles found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </main>

                {/* Right Sidebar - Ads (Preserved but can be hidden if user wants FULL width) 
                    User said "clean it up", "wasting space". 
                    I'll keep the right ad for business logic but ensure main grid expands.
                */}
                <aside className="w-80 shrink-0 hidden 2xl:block">
                    <div className="sticky top-44 space-y-6">
                        <AdPlacement slot="RIGHT_SIDEBAR" />
                    </div>
                </aside>
            </div>
        </div>
    );
}
