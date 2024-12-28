import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/translations";

export const ContactForm = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formType, setFormType] = useState<'listing' | 'advertisement'>('listing');
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    message: '',
    requestType: 'new',
    preferredPosition: 'top'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formType === 'listing') {
        await supabase.from('listing_requests').insert([{
          business_name: formData.businessName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          message: formData.message,
          request_type: formData.requestType
        }]);
      } else {
        await supabase.from('advertisement_requests').insert([{
          business_name: formData.businessName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          message: formData.message,
          preferred_position: formData.preferredPosition
        }]);
      }

      toast({
        title: t('success'),
        description: t('requestSubmitted'),
      });

      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        message: '',
        requestType: 'new',
        preferredPosition: 'top'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('error'),
        description: t('errorSubmitting'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm w-full max-w-lg mx-auto">
      <div className="space-y-4">
        <RadioGroup
          value={formType}
          onValueChange={(value) => setFormType(value as 'listing' | 'advertisement')}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="listing" id="listing" />
            <Label htmlFor="listing">{t('listingRequest')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advertisement" id="advertisement" />
            <Label htmlFor="advertisement">{t('advertisementRequest')}</Label>
          </div>
        </RadioGroup>

        {formType === 'listing' && (
          <RadioGroup
            value={formData.requestType}
            onValueChange={(value) => setFormData({ ...formData, requestType: value })}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">{t('newListing')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="edit" id="edit" />
              <Label htmlFor="edit">{t('editListing')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delete" id="delete" />
              <Label htmlFor="delete">{t('deleteListing')}</Label>
            </div>
          </RadioGroup>
        )}

        {formType === 'advertisement' && (
          <RadioGroup
            value={formData.preferredPosition}
            onValueChange={(value) => setFormData({ ...formData, preferredPosition: value })}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="top" />
              <Label htmlFor="top">{t('topPosition')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sidebar" id="sidebar" />
              <Label htmlFor="sidebar">{t('sidebarPosition')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="bottom" />
              <Label htmlFor="bottom">{t('bottomPosition')}</Label>
            </div>
          </RadioGroup>
        )}

        <div className="grid gap-4">
          <div>
            <Label htmlFor="businessName">{t('businessName')}</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contactName">{t('contactName')}</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="message">{t('message')}</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-caribbean"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
};