import { getReports } from "@/lib/moderation-actions";
import { ReportActionButtons } from "@/components/admin/report-actions";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ReportsPage() {
    const reports = await getReports("PENDING");

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Moderation Queue</h1>
            <p className="text-muted-foreground">Pending reports requiring review.</p>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-medium">REPORTED</span>
                                <span className="text-sm text-gray-500">
                                    {format(report.createdAt, "MMM d, yyyy")}
                                </span>
                            </div>

                            <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={report.reported.profileImage || ""} />
                                    <AvatarFallback>{report.reported.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-lg">{report.reported.name}</h3>
                                    <p className="text-sm text-muted-foreground">{report.reported.email}</p>
                                    <div className="mt-2 text-sm bg-gray-50 p-3 rounded border">
                                        <span className="font-semibold text-gray-700">Reason: </span>
                                        {report.reason}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Reported by: {report.reporter.name} ({report.reporter.email})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[150px]">
                            <ReportActionButtons reportId={report.id} />
                            <a
                                href={`/admin/users/${report.reported.id}`}
                                target="_blank"
                                className="text-xs text-center text-blue-600 hover:underline mt-2"
                            >
                                View Full Profile
                            </a>
                        </div>
                    </div>
                ))}

                {reports.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No pending reports! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
}
