import { Menu, Store } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";


interface AppHeaderProps {
  sidebarOpen: boolean;
  updateSidebarOpen: (open: boolean) => void;
}

function AppHeader({ sidebarOpen, updateSidebarOpen }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateSidebarOpen(!sidebarOpen)}
            className="mr-2 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-4 font-semibold text-lg"><Store /><a href='/'>General Store</a></div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    )
}

export default AppHeader;