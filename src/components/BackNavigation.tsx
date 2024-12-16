import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";

export const BackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const isHomePage = location.pathname === "/";

  if (isHomePage) return null;

  return (
    <div className="flex items-center space-x-2 mb-4 mt-20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        {t("home")}
      </Button>
    </div>
  );
};