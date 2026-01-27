import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DetailItemProps {
    label: string;
    value?: string | number | null;
}

function DetailItem({ label, value }: DetailItemProps) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
    );
}

interface DetailsSectionProps {
    title: string;
    icon?: LucideIcon;
    children?: React.ReactNode;
    items?: { label: string; value: string | number | null | undefined }[];
    className?: string;
}

export function DetailsSection({ title, icon: Icon, children, items, className }: DetailsSectionProps) {
    // If no items are valid and no children, don't render the card
    const hasContent = children || (items && items.some(i => i.value));
    if (!hasContent) return null;

    return (
        <Card className={className}>
            <CardHeader className="pb-3 border-b bg-gray-50/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
                    {Icon && <Icon className="w-4 h-4 text-blue-600" />}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                {items ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                        {items.map((item, idx) => (
                            <DetailItem key={idx} {...item} />
                        ))}
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}
