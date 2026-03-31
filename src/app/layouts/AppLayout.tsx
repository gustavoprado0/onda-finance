import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/AppSidebar";
import { Toaster } from "sonner";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-950">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4 py-2 md:hidden">
            <SidebarTrigger className="text-zinc-400 hover:text-white" />
            <span className="text-sm font-medium text-zinc-300">
              Onda Finance
            </span>
          </div>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}