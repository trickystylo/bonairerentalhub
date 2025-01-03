import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

interface AdSpaceProps {
  className?: string;
  position: "top" | "sidebar" | "bottom";
}

interface Advertisement {
  id: string;
  position: string;
  link: string;
  image_url: string | null;
  is_active: boolean;
}

export const AdSpace = ({ className, position }: AdSpaceProps) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('position', position)
          .eq('is_active', true)
          .limit(1);

        console.log(`Fetching ad for position: ${position}`, { data, error });

        if (error) {
          console.error("Error fetching advertisement:", error);
          return;
        }

        setAd(data && data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Error in ad fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAd();
  }, [position]);

  const positionStyles = {
    top: "w-full h-32 mb-8 mt-8",
    sidebar: "w-64 h-[600px]",
    bottom: "w-full h-32 mt-8",
  };

  const placeholderGradients = {
    top: "from-purple-500 to-blue-500",
    sidebar: "from-blue-500 to-teal-500",
    bottom: "from-teal-500 to-emerald-500",
  };

  if (isLoading) {
    return null;
  }

  const handleClick = () => {
    if (ad?.link) {
      window.open(ad.link, '_blank', 'noopener,noreferrer');
    }
  };

  if (!ad?.is_active) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={cn(
              "rounded-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer",
              `bg-gradient-to-br ${placeholderGradients[position]}`,
              positionStyles[position],
              className
            )}
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
              <div className="text-4xl">✨</div>
              <p className="text-sm font-medium">{t('advertisementSpace')}</p>
              <p className="text-xs opacity-75">{t('clickToAdvertise')}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('contactUs')}</DialogTitle>
          </DialogHeader>
          <ContactForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div
      role="button"
      onClick={handleClick}
      className={cn(
        "block rounded-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer",
        positionStyles[position],
        className
      )}
    >
      {ad.image_url ? (
        <img
          src={ad.image_url}
          alt="Advertisement"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Error loading image:", ad.image_url);
            e.currentTarget.src = "placeholder.svg";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white p-4 text-center space-y-2">
          <div className="text-4xl">🎯</div>
          <p className="font-medium">Special Offer</p>
          <p className="text-sm opacity-75">Click to learn more</p>
        </div>
      )}
    </div>
  );
};