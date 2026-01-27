import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
    isVerified?: boolean;
    className?: string;
    showText?: boolean;
}

export function VerificationBadge({ isVerified, className, showText = true }: VerificationBadgeProps) {
    if (!isVerified) return null;

    return (
        <Badge variant="secondary" className={cn("bg-blue-50 text-blue-700 border-blue-200 gap-1", className)}>
            <CheckCircle2 className="w-3 h-3 text-blue-600 fill-blue-100" />
            {showText && <span>Verified Professional</span>}
        </Badge>
    );
}
