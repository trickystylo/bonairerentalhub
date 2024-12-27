import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const rejectionTimestamp = localStorage.getItem('cookieConsentRejectionTime');
    
    if (!consent) {
      if (rejectionTimestamp) {
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        const rejectionTime = parseInt(rejectionTimestamp);
        const now = Date.now();
        
        if (now - rejectionTime > oneHour) {
          setShowBanner(true);
        }
      } else {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsentRejectionTime', Date.now().toString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 flex-1">
          {t('cookieConsentText')}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecline}
          >
            {t('decline')}
          </Button>
          <Button
            size="sm"
            className="bg-gradient-caribbean"
            onClick={handleAccept}
          >
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};