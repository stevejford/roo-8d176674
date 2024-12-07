import { LogOut } from "lucide-react";

interface AppFooterProps {
  isAdmin: boolean;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export const AppFooter = ({ isAdmin, isLoggedIn, onSignOut }: AppFooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 z-40">
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
        </div>
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Roo Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
};