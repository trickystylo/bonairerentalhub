import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const rejectionTimestamp = localStorage.getItem('cookieRejectionTimestamp');
    
    if (!consent) {
      if (rejectionTimestamp) {
        const oneHour = 60 * 60 * 1000; // milliseconds
        const now = new Date().getTime();
        if (now - parseInt(rejectionTimestamp) > oneHour) {
          setShowConsent(true);
        }
      } else {
        setShowConsent(true);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieRejectionTimestamp', new Date().getTime().toString());
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600">{t('cookieConsentText')}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDecline}>
            {t('decline')}
          </Button>
          <Button onClick={handleAccept}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
};