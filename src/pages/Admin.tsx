import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { ProductList } from '@/components/admin/products/ProductList';
import { OrderList } from '@/components/admin/orders/OrderList';
import { UserManagement } from '@/components/admin/users/UserManagement';
import { KitchenDashboard } from '@/components/admin/orders/KitchenDashboard';
import { POSDashboard } from '@/components/admin/pos/POSDashboard';
import { PricingModelList } from '@/components/admin/pricing/PricingModelList';
import { StoreSettingsForm } from '@/components/admin/settings/StoreSettingsForm';
import { StoreHoursForm } from '@/components/admin/settings/StoreHoursForm';
import { SettingsSectionHeader } from '@/components/admin/settings/SettingsSectionHeader';
import { MenuPage } from '@/components/admin/orders/MenuPage';
import { TableGrid } from '@/components/admin/tables/TableGrid';
import { WaiterDashboard } from '@/components/admin/waiter/WaiterDashboard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Package, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  ShoppingCart,
  BarChart,
  DollarSign,
  Utensils,
  ClipboardList,
  Plus,
  Menu,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">--</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Products</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">--</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">--</div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const Products = () => (
  <div className="space-y-6">
    <ProductList />
  </div>
);

const Orders = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
    </div>
    <OrderList />
  </div>
);

const UsersManagement = () => (
  <div className="space-y-6">
    <UserManagement />
  </div>
);

const Analytics = () => (
  <div>Analytics dashboard coming soon</div>
);

const SettingsPanel = () => (
  <div className="space-y-8">
    <div>
      <SettingsSectionHeader
        title="Business Information"
        description="Manage your restaurant's basic information and contact details"
      />
      <StoreSettingsForm />
    </div>
    
    <div>
      <SettingsSectionHeader
        title="Operating Hours"
        description="Set your restaurant's opening and closing hours for each day of the week"
      />
      <StoreHoursForm />
    </div>
  </div>
);

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Quick Add Order', href: '/admin/pos', icon: Plus },
    { name: 'Waiter View', href: '/admin/waiter', icon: Menu },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Kitchen', href: '/admin/kitchen', icon: Utensils },
    { name: 'Tables', href: '/admin/tables', icon: ClipboardList },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={isAdmin} onCategoryClick={() => {}} onSignOut={handleSignOut} />
      
      <div className="flex pt-16">
        {/* Mobile Menu Trigger */}
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="icon">
                <PanelLeftOpen className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <nav className="flex flex-col h-full bg-white py-4">
                {navigation.map((item) => {
                  const isActive = window.location.pathname === item.href;
                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.href)}
                      className={`${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-4 py-2 text-sm font-medium`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 flex-shrink-0 h-5 w-5`}
                      />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r fixed h-[calc(100vh-4rem)] top-16">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = window.location.pathname === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64 p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="pos/*" element={<POSDashboard />} />
            <Route path="waiter/*" element={<WaiterDashboard />} />
            <Route path="products/*" element={<Products />} />
            <Route path="pricing/*" element={<PricingModelList />} />
            <Route path="orders/*" element={<Orders />} />
            <Route path="kitchen/*" element={<KitchenDashboard />} />
            <Route path="tables/*" element={<TableGrid />} />
            <Route path="users/*" element={<UsersManagement />} />
            <Route path="analytics/*" element={<Analytics />} />
            <Route path="settings/*" element={<SettingsPanel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;