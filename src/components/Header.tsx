import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";
import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold bg-gradient-caribbean bg-clip-text text-transparent">
            HureninBonaire.com
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="transition-colors hover:text-primary">
            {t("home")}
          </Link>
          <Link to="/categories" className="transition-colors hover:text-primary">
            {t("categories")}
          </Link>
          <Link to="/featured" className="transition-colors hover:text-primary">
            {t("featured")}
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAuthClick}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </div>
      </div>
    </header>
  );
};