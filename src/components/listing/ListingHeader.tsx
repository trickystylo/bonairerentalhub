import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "../../translations";
import { Header } from "../Header";

export const ListingHeader = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <Header />
      <div className="fixed top-16 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{t("back")}</span>
            </button>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">{t("home")}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};