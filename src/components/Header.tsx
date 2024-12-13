import { Globe, Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              <span className="text-secondary">Huren</span>inBonaire
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100">
              <Globe className="w-5 h-5" />
              <span>NL/EN</span>
            </button>
          </div>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <button className="flex items-center space-x-2 px-4 py-2 w-full rounded-md hover:bg-gray-100">
              <Globe className="w-5 h-5" />
              <span>NL/EN</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};