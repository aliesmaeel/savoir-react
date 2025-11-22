import React from "react";
import PageLayout from "~/layouts/PageLayout";
import Header from "~/UI/Header";

export default function PrivacyPolicy() {
  return (
    <div>
      <PageLayout>
        <div className="flex flex-col items-start gap-[30px] lg:gap-[40px] w-full py-[30px] lg:py-[60px]">
          <Header className="text-[24px] lg:text-[48px]">Privacy Policy</Header>
          
          <div className="flex flex-col gap-[24px] lg:gap-[32px] text-[14px] lg:text-[18px] leading-[180%]">
            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">1. Introduction</h2>
              <p>
                Savoir Properties ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This Privacy Policy describes how we collect, use, store, and disclose your information when you visit or use our website www.savoirproperties.com (the "Website"), subscribe to our newsletter or market reports, or otherwise interact with us. By using our Website or providing us with your information, you agree to this Policy.
              </p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">2. What Information We Collect</h2>
              <p>We collect personal and non-personal data from you depending on your interactions with us:</p>
              
              <div className="flex flex-col gap-[12px] ml-[16px]">
                <h3 className="text-[16px] lg:text-[20px] font-semibold">Personal Information</h3>
                <p>You may provide us with personal data, for example when you:</p>
                <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                  <li>Fill out contact / enquiry forms</li>
                  <li>Subscribe to the newsletter or market report</li>
                  <li>Register for an account (if applicable)</li>
                  <li>Communicate with us by email, phone, chat, or social media</li>
                </ul>
                <p className="mt-[8px]">Typical types of personal information include:</p>
                <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Residential address (if required)</li>
                  <li>Nationality, ID details (if necessary under law or in property transactions)</li>
                  <li>Any other information you volunteer or which is necessary for the service requested</li>
                </ul>
              </div>

              <div className="flex flex-col gap-[12px] ml-[16px]">
                <h3 className="text-[16px] lg:text-[20px] font-semibold "> Non Personal  Usage Information</h3>
                <p>We automatically collect certain technical or usage data, such as:</p>
                <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device type (mobile / desktop)</li>
                  <li>Pages visited, time spent on pages</li>
                  <li>Referring page URLs</li>
                  <li>Cookies, pixels, web beacons, or similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">3. How We Use Your Information</h2>
              <p>We use the collected data for several purposes:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>To respond to your inquiries or requests</li>
                <li>To send you newsletters, reports, updates, or promotional material (if you have opted in)</li>
                <li>To provide, maintain, and improve our Website and services</li>
                <li>To conduct market research and understand trends</li>
                <li>To facilitate property listings, viewings, and sales or rental transactions</li>
                <li>To comply with legal obligations and regulatory requirements (e.g. identity verification)</li>
                <li>To prevent fraud, abuse, or other unlawful activity</li>
                <li>To personalize your experience (e.g. show you content or properties that match your preferences)</li>
              </ul>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">4. Legal Basis for Processing</h2>
              <p>Where applicable, our processing of your personal data is based on one or more of the following legal grounds:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>Your consent (e.g. for marketing communications)</li>
                <li>Performance of a contract or taking steps at your request (e.g. property transaction or request)</li>
                <li>Compliance with legal / regulatory obligations under UAE law</li>
                <li>Legitimate interests (e.g. improving website functionality, ensuring security, preventing fraud)</li>
              </ul>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">5. Cookies & Tracking Technologies</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>Enable website functionality</li>
                <li>Improve performance and user experience</li>
                <li>Collect analytics data</li>
                <li>Serve personalized content and advertising</li>
              </ul>
              <p>You may decline or disable cookies via your browser settings. However, disabling some cookies may affect how fully our Website functions for you.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">6. Sharing and Disclosure of Your Information</h2>
              <p>We may share your personal information with:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>Service providers, contractors, or third parties who assist us (e.g. email service providers, payment processors, website hosting, analytics tools)</li>
                <li>Legal, regulatory or governmental authorities when required by law or to protect our rights or safety</li>
                <li>Business partners for co-promotions or related services (only if you consent or it is otherwise legitimate)</li>
                <li>In the event of a merger, acquisition, reorganization or sale of our assets</li>
              </ul>
              <p>We do not sell your personal data to unrelated third parties.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">7. Data Security</h2>
              <p>We take appropriate technical, administrative, and organizational measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction. These include:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>Secure servers and encrypted connections (e.g. SSL/TLS)</li>
                <li>Access controls and staff training</li>
                <li>Regular audits of data security</li>
              </ul>
              <p>However, no internet transmission can be guaranteed 100% secure. By using the Website, you understand and accept this risk.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">8. Data Retention</h2>
              <p>We retain your personal data only as long as necessary for the purposes for which it was collected, or as required by law. Once no longer needed, we will securely delete, anonymize, or archive your data.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">9. Your Rights</h2>
              <p>Depending on applicable laws (e.g. UAE's Personal Data Protection Law), you may have rights over your personal data, including:</p>
              <ul className="list-disc ml-[24px] flex flex-col gap-[8px]">
                <li>Access to the personal data we hold about you</li>
                <li>Correction of inaccurate or incomplete data</li>
                <li>Deletion or erasure of data under certain conditions</li>
                <li>Withdrawal of consent where consent was the basis for processing</li>
                <li>Restriction of processing in certain cases</li>
                <li>Objection to direct marketing or profiling</li>
              </ul>
              <p>To exercise these rights, please contact us using the details below.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">10. Third-party Links</h2>
              <p>Our Website may contain links to other websites. We are not responsible for the privacy practices or policies of those sites. Once you leave our Website, you should review their privacy policies.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">11. Children's Privacy</h2>
              <p>Our Website and services are not intended for children under 16 (or the age required by local law). We do not knowingly collect personal data from children below that age. If you believe we have collected data from a child, please contact us so we can delete it.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">12. Changes to This Privacy Policy</h2>
              <p>We may update this Policy from time to time. When we do, we will post the new version on this page and update the "Last Updated" date. If changes are significant, we may notify you via email or via a notice on our Website.</p>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">13. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, or want to exercise any of your rights, you can contact us:</p>
              <div className="flex flex-col gap-[8px] ml-[16px]">
                <p className="font-semibold">Savoir Properties</p>
                <p>Email: <a href="mailto:info@saviorproperties.com" className="text-[#C6A45A] underline">info@saviorproperties.com</a></p>
                <p>Address: Clover Bay, 2026, Business Bay</p>
                <p>Phone: <a href="tel:+971505074686" className="text-[#C6A45A] underline">+971505074686</a></p>
              </div>
            </section>

            <section className="flex flex-col gap-[16px]">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-[#C6A45A]">14. Governing Law</h2>
              <p>This Privacy Policy and any disputes or claims arising out of or in connection with it shall be governed by the laws of the United Arab Emirates.</p>
            </section>

            <div className="pt-[16px] text-[12px] lg:text-[14px] text-gray-600">
              <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </PageLayout>
    </div>
  );
}

