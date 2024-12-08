import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  Package, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  ShoppingCart,
  BarChart,
  Plus 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductList } from '@/components/admin/products/ProductList';

// Placeholder components for each section
const Dashboard = () => {
  console.log('Rendering Dashboard component');
  return (
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
};

const Products = () => {
  console.log('Rendering Products component');
  return (
    <div className="space-y-6">
      <ProductList />
    </div>
  );
};

const Orders = () => {
  console.log('Rendering Orders component');
  return (
    <div>Orders management coming soon</div>
  );
};

const UsersManagement = () => {
  console.log('Rendering UsersManagement component');
  return (
    <div>User management coming soon</div>
  );
};

const Analytics = () => {
  console.log('Rendering Analytics component');
  return (
    <div>Analytics dashboard coming soon</div>
  );
};

const SettingsPanel = () => {
  console.log('Rendering SettingsPanel component');
  return (
    <div>Settings panel coming soon</div>
  );
};

const Admin = () => {
  console.log('Rendering Admin component');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  ];

  console.log('Admin component - isAdmin:', isAdmin);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSignOut={handleSignOut} isAdmin={isAdmin} onCategoryClick={() => {}} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white border-r">
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
        <div className="flex-1 overflow-auto p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products/*" element={<Products />} />
            <Route path="orders/*" element={<Orders />} />
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