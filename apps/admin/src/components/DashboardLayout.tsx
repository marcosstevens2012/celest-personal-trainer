"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BarChart3, BookOpen, DollarSign, FileText, Home, LogOut, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Estudiantes", href: "/students", icon: Users },
      { name: "Planes", href: "/plans", icon: BookOpen },
    ],
  },
  {
    title: "Gestión",
    items: [
      { name: "Pagos", href: "/payments", icon: DollarSign },
      { name: "Reportes", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Sistema",
    items: [{ name: "Configuración", href: "/settings", icon: Settings }],
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">Celest PT</span>
              <span className="text-xs text-muted-foreground">Personal Trainer</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2">
          {navigationItems.map((section, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2">{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{user?.name || "Usuario"}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email || "trainer@example.com"}</span>
            </div>
          </div>
          <Separator className="my-2" />
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-1 items-center gap-2 text-sm">
            <span className="font-medium">Panel de Control</span>
          </div>
        </header>

        <main className="flex-1 p-6 bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
