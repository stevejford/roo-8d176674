import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarSection } from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Settings,
  Coffee,
  ChefHat,
  ShoppingCart,
  Table2,
  PieChart,
  Tag,
  DollarSign,
} from "lucide-react";

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Sidebar>
      <SidebarSection>
        <div className="space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              location.pathname === "/admin" ? "bg-accent" : ""
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/pos"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/pos") ? "bg-accent" : ""
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>POS</span>
          </Link>
          <Link
            to="/admin/waiter"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/waiter") ? "bg-accent" : ""
            }`}
          >
            <Coffee className="h-4 w-4" />
            <span>Waiter</span>
          </Link>
          <Link
            to="/admin/kitchen"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/kitchen") ? "bg-accent" : ""
            }`}
          >
            <ChefHat className="h-4 w-4" />
            <span>Kitchen</span>
          </Link>
          <Link
            to="/admin/tables"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/tables") ? "bg-accent" : ""
            }`}
          >
            <Table2 className="h-4 w-4" />
            <span>Tables</span>
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/orders") ? "bg-accent" : ""
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Orders</span>
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/products") ? "bg-accent" : ""
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Products</span>
          </Link>
          <Link
            to="/admin/pricing"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/pricing") ? "bg-accent" : ""
            }`}
          >
            <DollarSign className="h-4 w-4" />
            <span>Pricing</span>
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/users") ? "bg-accent" : ""
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/analytics") ? "bg-accent" : ""
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive("/admin/settings") ? "bg-accent" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
      </SidebarSection>
    </Sidebar>
  );
};