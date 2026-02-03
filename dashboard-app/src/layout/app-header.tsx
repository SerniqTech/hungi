import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AppHeader = () => {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <header
      className="w-full h-12.25 flex items-center px-2 bg-sidebar border-b"
      style={{ justifyContent: isMobile ? "space-between" : "end" }}
    >
      {isMobile && <div className="text-primary text-2xl font-bold">Hungi</div>}
      {isMobile && (
        <Button variant="ghost" onClick={toggleSidebar}>
          <Menu />
        </Button>
      )}
      {!isMobile && (
        <Avatar>
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="@shadcn"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </header>
  );
};

export default AppHeader;
