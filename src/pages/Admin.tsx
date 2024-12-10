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
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Dashboard = () => (
  <div className="space-y-6 p-8">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={isAdmin} onCategoryClick={() => {}} onSignOut={handleSignOut} />
      
      <div className="pt-16">
        <SidebarProvider defaultOpen>
          <AdminSidebar />
          <SidebarInset className="xl:pl-64">
            <div className="flex items-center p-4 border-b lg:hidden">
              <SidebarTrigger />
            </div>
            <div className="h-[calc(100vh-4rem)]">
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
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Admin;