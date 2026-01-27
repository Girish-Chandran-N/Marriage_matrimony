import { getLogs } from "@/lib/logging-actions";
import { format } from "date-fns";

export default async function ActivityLogsPage() {
    const logs = await getLogs(100);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Activity Logs</h1>
            <p className="text-muted-foreground">Recent system activities.</p>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Time</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Action</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Details</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">
                                        {format(log.createdAt, "MMM d, HH:mm")}
                                    </td>
                                    <td className="p-4 align-middle font-medium">
                                        {log.user.name || log.user.email}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${log.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {log.user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {log.action}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground max-w-xs truncate" title={log.details || ""}>
                                        {log.details || "-"}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
