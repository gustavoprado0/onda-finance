import { LayoutDashboard, ArrowLeftRight, Waves } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { cn } from "../lib/utils";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transferência", url: "/transfer", icon: ArrowLeftRight },
];

export function AppSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-950">
      <SidebarHeader className="p-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Waves size={16} className="text-cyan-400" />
          </div>
          <span className="font-bold text-zinc-600 text-sm">Onda Finance</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-600 text-xs uppercase tracking-wider px-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-2">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        "cursor-pointer rounded-lg h-10 gap-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      )}
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        <div className="border border-gray-300 rounded-xl p-3">
          <p className="text-xs text-gray-900 mb-0.5">Logado como</p>
          <p className="text-xs text-gray-900 font-medium truncate">{user}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full text-red-500 border-red-400 hover:text-red-400 hover:bg-red-500/10 gap-2 cursor-pointer"
          onClick={() => {
            logout();
            toast.success("Sessão encerrada");
            navigate("/login");
          }}
        >
          <LogOut size={15} />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}