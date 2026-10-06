/**
 * Company contact channels, as published on the website
 * (app/components/ContactUs/ContactUsForm.tsx and
 * app/components/Project/BookYourViewing/BookYourViewing.tsx).
 */
import type { ContactOptions } from "./schemas.js";
import { whatsappUrl } from "./cms/sanitize.js";

export const COMPANY_PHONE = "+971505074686";
export const COMPANY_EMAIL = "info@savoirproperties.com";
export const OFFICE_ADDRESS = "Emaar Business Park, Bldg.4, Office 502, Shk. Zayed Road, Dubai";

export function companyContact(publicSiteUrl: string, inquiriesEnabled: boolean): ContactOptions {
  return {
    website_url: `${publicSiteUrl}/`,
    contact_page_url: `${publicSiteUrl}/contact-us`,
    email: COMPANY_EMAIL,
    email_url: `mailto:${COMPANY_EMAIL}`,
    phone: COMPANY_PHONE,
    phone_url: `tel:${COMPANY_PHONE}`,
    whatsapp_url: whatsappUrl(COMPANY_PHONE) as string,
    office_address: OFFICE_ADDRESS,
    online_inquiries_enabled: inquiriesEnabled,
  };
}

export function privacyPolicyUrl(publicSiteUrl: string): string {
  return `${publicSiteUrl}/privacy-policy`;
}
