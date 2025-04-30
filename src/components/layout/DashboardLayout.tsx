
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
import { Calendar, User, Users, Clock, Pill, Search, Menu, UserSquare } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border">
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
              <SidebarTrigger className="mr-2" />
              <div className="lg:hidden">
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="text-lg font-semibold ml-4">Sistema de Gerenciamento de Asilo</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
