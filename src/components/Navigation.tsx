import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";
import { Json } from "@/integrations/supabase/types";

interface Category {
  id: string;
  name: string;
  icon: string;
  listingCount?: number;
  translations?: Json;
  created_at?: string | null;
  display_order?: number | null;
}

interface NavigationProps {
  onCategoryChange?: (category: string | null) => void;
  selectedCategory: string | null;
  additionalCategories?: { id: string; name: string; icon?: string }[];
}

export const Navigation = ({ onCategoryChange, selectedCategory, additionalCategories = [] }: NavigationProps) => {
  // Hide this component completely
  return null;
};