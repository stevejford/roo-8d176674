import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppFooterProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export const AppFooter = ({ isAdmin, isLoggedIn, onSignOut }: AppFooterProps) => {
  const navigate = useNavigate();
  
  return (
    <footer className="relative bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <button
              onClick={onSignOut}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
              {isAdmin && <span>Admin Logout</span>}
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Admin Dashboard
            </button>
          )}
        </div>
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Roo Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
};