import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchAd = async () => {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching advertisement:", error);
        return;
      }

      setAd(data);
    };

    fetchAd();
  }, [position]);

  const positionStyles = {
    top: "w-full h-32 mb-8",
    sidebar: "w-64 h-[600px]",
    bottom: "w-full h-32 mt-8",
  };

  if (!ad?.is_active) {
    return null;
  }

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded-lg overflow-hidden transition-transform hover:scale-[1.02]",
        positionStyles[position],
        className
      )}
    >
      {ad.image_url ? (
        <img
          src={ad.image_url}
          alt="Advertisement"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-caribbean flex items-center justify-center text-white p-4 text-center">
          Advertisement Space
        </div>
      )}
    </a>
  );
};