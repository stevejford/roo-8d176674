import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, 
  Package, 
  Users, 
  Settings,
  ShoppingCart,
  BarChart,
  DollarSign,
  Utensils,
  ClipboardList,
  Plus,
  Menu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'POS Dashboard', href: '/admin/pos', icon: Plus },
    { name: 'Waiter View', href: '/admin/waiter', icon: Menu },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Kitchen', href: '/admin/kitchen', icon: Utensils },
    { name: 'Tables', href: '/admin/tables', icon: ClipboardList },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive}
                  onClick={() => navigate(item.href)}
                  tooltip={item.name}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}