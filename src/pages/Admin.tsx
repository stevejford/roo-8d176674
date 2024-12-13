import { Toaster } from "@/components/ui/toaster";
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
import { ServiceTimingForm } from '@/components/admin/settings/ServiceTimingForm';
import { DeliveryZonesForm } from '@/components/admin/settings/DeliveryZonesForm';
import { BillSplittingForm } from '@/components/admin/settings/BillSplittingForm';
import { StripeConfigForm } from '@/components/admin/settings/StripeConfigForm';
import { SettingsSectionHeader } from '@/components/admin/settings/SettingsSectionHeader';
import { MenuPage } from '@/components/admin/orders/MenuPage';
import { TableGrid } from '@/components/admin/tables/TableGrid';
import { WaiterDashboard } from '@/components/admin/waiter/WaiterDashboard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessInfoForm } from '@/components/admin/settings/BusinessInfoForm';

const Dashboard = () => (
  <div className="p-8">
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
  <div className="p-8">
    <ProductList />
  </div>
);

const Orders = () => (
  <div className="p-8">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
    </div>
    <OrderList />
  </div>
);

const UsersManagement = () => (
  <div className="p-8">
    <UserManagement />
  </div>
);

const Analytics = () => (
  <AnalyticsDashboard />
);

const SettingsPanel = () => (
  <div className="p-8">
    <Tabs defaultValue="business" className="space-y-8">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="business">Business Info</TabsTrigger>
        <TabsTrigger value="hours">Operating Hours</TabsTrigger>
        <TabsTrigger value="service">Service Timings</TabsTrigger>
        <TabsTrigger value="delivery">Delivery Zones</TabsTrigger>
        <TabsTrigger value="billing">Bill Splitting</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
      </TabsList>

      <TabsContent value="business">
        <div>
          <SettingsSectionHeader
            title="Business Information"
            description="Manage your restaurant's basic information and contact details"
          />
          <BusinessInfoForm
            defaultValues={{
              store_name: '',
              address: '',
              accept_preorders: true,
            }}
            onSubmit={() => {}}
          />
        </div>
      </TabsContent>

      <TabsContent value="hours">
        <StoreHoursForm />
      </TabsContent>

      <TabsContent value="service">
        <ServiceTimingForm />
      </TabsContent>

      <TabsContent value="delivery">
        <DeliveryZonesForm />
      </TabsContent>

      <TabsContent value="billing">
        <div>
          <SettingsSectionHeader
            title="Bill Splitting"
            description="Configure how customers can split their bills"
          />
          <BillSplittingForm
            defaultValues={{
              enabled: true,
              max_splits: 4,
              min_amount_per_split: 5,
              allow_uneven_splits: true,
            }}
            onSubmit={() => {}}
          />
        </div>
      </TabsContent>

      <TabsContent value="payment">
        <StripeConfigForm />
      </TabsContent>
    </Tabs>
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
    <div className="min-h-screen bg-background">
      <Navbar isAdmin={isAdmin} onCategoryClick={() => {}} onSignOut={handleSignOut} />
      
      <div className="pt-16">
        <SidebarProvider defaultOpen>
          <AdminSidebar />
          <SidebarInset>
            <div className="flex items-center p-4 border-b lg:hidden">
              <SidebarTrigger />
            </div>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="pos/*" element={<POSDashboard />} />
              <Route path="waiter/*" element={<WaiterDashboard />} />
              <Route path="products/*" element={<Products />} />
              <Route path="pricing/*" element={<PricingModelList />} />
              <Route path="orders/*" element={<Orders />} />
              <Route path="kitchen/*" element={<KitchenDashboard />} />
              <Route path="tables/*" element={<TableGrid />} />
              <Route path="users/*" element={<UserManagement />} />
              <Route path="analytics/*" element={<Analytics />} />
              <Route path="settings/*" element={<SettingsPanel />} />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Admin;
