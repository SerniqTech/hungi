import {
  Calendar,
  Home,
  Inbox,
  SquareChartGantt,
  PhoneCall,
  WalletMinimal,
  UserRound,
  Handshake,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminNavItems = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Orders",
    url: "orders",
    icon: Inbox,
  },
  {
    title: "Subscriptions",
    url: "subscriptions",
    icon: Calendar,
  },
  {
    title: "Vendors",
    url: "vendor",
    icon: Handshake,
  },
  {
    title: "Users",
    url: "users",
    icon: UserRound,
  },
  {
    title: "Payments",
    url: "payments",
    icon: WalletMinimal,
  },
];

const vendorNavItems = [
  {
    title: "Home",
    url: "home",
    icon: Home,
  },
  {
    title: "Menu",
    url: "menu",
    icon: SquareChartGantt,
  },
  {
    title: "Support",
    url: "support",
    icon: PhoneCall,
  },
];

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="text-primary text-2xl font-bold m-auto">Hungi</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {isMobile && <SidebarFooter>Logout</SidebarFooter>}
    </Sidebar>
  );
}
