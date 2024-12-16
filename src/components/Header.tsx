import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

export const Header = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Bonaire Business Directory</span>
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
        </div>
      </div>
    </header>
  );
};