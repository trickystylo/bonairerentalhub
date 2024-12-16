import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "../translations";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Header = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdmin(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      checkAdmin(session.user.id);
    }
  };

  const checkAdmin = async (userId: string | undefined) => {
    if (!userId) return;
    
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    setIsAdmin(!!adminData);
  };

  const handleAuthClick = async () => {
    if (session) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        await supabase.auth.signOut();
        navigate('/');
      }
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

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAuthClick}
            className="flex items-center gap-2"
          >
            {session ? (
              isAdmin ? (
                <>
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </>
              )
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};