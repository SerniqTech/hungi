import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./app-sidebar";
import AppHeader from "./app-header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-dvw h-dvh">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
