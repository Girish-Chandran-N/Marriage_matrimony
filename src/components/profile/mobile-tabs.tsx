import { Button } from "@/components/ui/button";
import { User, Users, Phone } from "lucide-react";

interface MobileTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
    return (
        <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-50 justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button
                variant="ghost"
                className={`flex flex-col items-center h-auto py-2 gap-1 ${activeTab === 'personal' ? 'text-purple-700 bg-purple-50' : 'text-gray-500'}`}
                onClick={() => onTabChange('personal')}
            >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-medium">Personal Details</span>
            </Button>

            <Button
                variant="ghost"
                className={`flex flex-col items-center h-auto py-2 gap-1 ${activeTab === 'family' ? 'text-purple-700 bg-purple-50' : 'text-gray-500'}`}
                onClick={() => onTabChange('family')}
            >
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-medium">Family Details</span>
            </Button>

            <Button
                variant="ghost"
                className={`flex flex-col items-center h-auto py-2 gap-1 ${activeTab === 'contact' ? 'text-purple-700 bg-purple-50' : 'text-gray-500'}`}
                onClick={() => onTabChange('contact')}
            >
                <Phone className="w-5 h-5" />
                <span className="text-[10px] font-medium">Contact Details</span>
            </Button>
        </div>
    );
}
