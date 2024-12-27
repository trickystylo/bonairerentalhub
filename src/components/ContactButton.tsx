import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

export const ContactButton = () => {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-caribbean hover:opacity-90 transition-opacity text-xs md:text-sm px-2 md:px-4"
          size="sm"
        >
          {t('contact')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('contactUs')}</DialogTitle>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
};