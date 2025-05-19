
import React from 'react';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 pt-4 px-4 md:px-6 gap-4 border-b border-border/40">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative flex-1 md:w-[260px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 w-full bg-background/50 border-muted focus:border-primary"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <div className="px-4 py-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            <div className="py-2 px-4 text-sm text-center text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
              <User size={18} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
};

export default DashboardHeader;
