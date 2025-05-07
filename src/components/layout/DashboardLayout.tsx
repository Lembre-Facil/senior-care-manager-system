
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Calendar, User, Users, Clock, Pill, Search, Menu, UserSquare, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Search, label: 'Dashboard', path: '/' },
    { icon: User, label: 'Pacientes', path: '/patients' },
    { icon: Calendar, label: 'Consultas', path: '/appointments' },
    { icon: Pill, label: 'Medicações', path: '/medications' },
    { icon: Users, label: 'Cuidadores', path: '/caregivers' },
    { icon: UserSquare, label: 'Médicos', path: '/doctors' },
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px]">
        <div className="h-full flex flex-col bg-sidebar">
          <div className="flex h-[60px] items-center px-4 border-b border-sidebar-border justify-between">
            <span className="font-semibold text-lg text-sidebar-foreground flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>SeniorCare</span>
            </span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-4 w-4 text-sidebar-foreground" />
            </Button>
          </div>
          <div className="flex flex-col p-2 space-y-1">
            {menuItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border hidden lg:block">
          <SidebarHeader className="flex h-[60px] items-center px-6">
            <span className="font-semibold text-lg text-sidebar-foreground flex items-center space-x-2">
              <Clock className="h-6 w-6" />
              <span>SeniorCare</span>
            </span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <NavLink to={item.path} className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-0">
          <header className="h-[60px] border-b border-border flex items-center px-4 sm:px-6">
            <div className="flex-1 flex items-center">
              <SidebarTrigger className="mr-2 hidden lg:flex" />
              <div className="lg:hidden">
                <MobileMenu />
              </div>
              <h1 className="text-lg font-semibold ml-2 md:ml-4">Sistema de Gerenciamento de Asilo</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
