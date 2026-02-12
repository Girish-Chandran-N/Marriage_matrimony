import { getMatches, MatchFilters } from "@/lib/match-actions";
import { MatchCard } from "@/components/matches/match-card";
import AdPlacement from "@/components/ad-placement";
import ProfessionFilterSidebar from "@/components/search/profession-filter-sidebar";

interface PageProps {
    params: {
        category: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProfessionSearchPage({ params, searchParams }: PageProps) {
    const category = decodeURIComponent(params.category);

    // Construct filters including the profession category
    const filters: MatchFilters = {
        employmentCategory: category, // This forces the "Job" based filter in our updated getMatches logic?
        // Wait, getMatches implementation checked: 
        // if (filters.employmentCategory && c.jobs?.[0]?.employmentCategory !== filters.employmentCategory) return false;
        // So this is correct.

        // Map other searchParams to filters
        ageMin: searchParams.ageMin ? Number(searchParams.ageMin) : undefined,
        ageMax: searchParams.ageMax ? Number(searchParams.ageMax) : undefined,
        minHeight: searchParams.minHeight ? Number(searchParams.minHeight) : undefined,
        maxHeight: searchParams.maxHeight ? Number(searchParams.maxHeight) : undefined,

        religion: searchParams.religion as string,
        caste: searchParams.caste as string,
        gender: searchParams.gender as string,

        // Locations (Arrays)
        workingCountry: searchParams.workingCountry as string, // Sidebar sends comma separated? 
        // Sidebar logic: params.set(key, value.join(","))
        // So searchParams.workingCountry might be "India,USA".
        // getMatches logic: 
        // if (filters.workingCountry && pd.residingCountry !== filters.workingCountry)
        // It expects a SINGLE string match currently in getMatches logic?
        // Let's check getMatches logic again.
        // line 311: if (filters.workingCountry && pd.residingCountry !== filters.workingCountry)
        // It checks strict equality.
        // If we want multiple countries support, we need to update getMatches logic to support arrays or check includes.
        // The Prompt requirement "Sidebar checkboxes" implies multiple selection.
        // So I should update getMatches to handle comma-separated strings for location filters too.
    };

    // FETCH MATCHES
    const matches = await getMatches(filters);

    // Determine Ad content based on category?
    // "Right Side Ad Banner".

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-indigo-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        <span className="text-indigo-600">{category}</span>{" "}
                        Brides & Grooms
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Showing {Array.isArray(matches) ? matches.length : 0} profiles matching your criteria
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

                {/* Left Sidebar */}
                <aside className="w-full md:w-80 shrink-0">
                    <ProfessionFilterSidebar category={category} />
                </aside>

                {/* Center Content */}
                <div className="flex-1">
                    {Array.isArray(matches) && matches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {matches.map((match: any) => (
                                <MatchCard key={match.user.id} user={match.user} score={match.score} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-slate-800">No profiles found</h3>
                            <p className="text-slate-500">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>

                {/* Right Ad Banner */}
                <aside className="w-full md:w-72 shrink-0 hidden xl:block space-y-6">
                    <AdPlacement placement="SIDEBAR" />
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-200">
                        <h3 className="font-bold text-lg mb-2">Upgrade to Premium</h3>
                        <p className="text-white/90 text-sm mb-4">Contact {category} professionals directly without waiting.</p>
                        <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform">
                            View Plans
                        </button>
                    </div>
                </aside>

            </main>
        </div>
    );
}
