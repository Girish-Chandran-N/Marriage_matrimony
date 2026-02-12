import { getProfessionCounts } from "@/lib/user-actions";
import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";

export default async function ProfessionLandingPage() {
    const counts = await getProfessionCounts();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
                        Browse Profiles by <span className="text-indigo-600">Profession</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-600">
                        Find your perfect match from a wide range of professional backgrounds.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {counts.map((item) => (
                            <Link
                                key={item.category}
                                href={`/search/profession/${encodeURIComponent(item.category)}`}
                                className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <Briefcase size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                            {item.category}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {item.count} Profiles
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {counts.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No professional categories found at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
