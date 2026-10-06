import type { Metadata } from "next";
import { LegalContact, LegalPage } from "@/components/legal/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Fluxline LLC collects, uses, and protects information submitted through fluxlinesolutions.com.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <p>
          This policy explains how {site.legalName} (&quot;Fluxline,&quot; &quot;we,&quot; or &quot;us&quot;) handles
          information collected through {site.domain} (the &quot;website&quot;). We aim to collect as little as we
          need and to use it only for the reasons described here.
        </p>
      </section>

      <section>
        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong className="text-ink">Information you submit.</strong> When you request a call, we receive your
            name, company, business email, phone number, preferred time to call, and any message you choose to include.
          </li>
          <li>
            <strong className="text-ink">Technical information.</strong> Like most websites, our hosting provider
            automatically processes basic technical data such as IP address, browser type, pages requested, and
            timestamps. This is used to deliver the website, keep it secure, and prevent abuse.
          </li>
        </ul>
        <p>This website does not use advertising cookies or tracking pixels.</p>
      </section>

      <section>
        <h2>How we use information</h2>
        <ul>
          <li>To respond to your request and coordinate a call.</li>
          <li>To communicate with you about our services when you have contacted us.</li>
          <li>To protect the website against spam, fraud, and abuse.</li>
          <li>To meet legal obligations.</li>
        </ul>
      </section>

      <section>
        <h2>How information is shared</h2>
        <p>
          We do not sell personal information. We share it only with service providers that help us operate the
          website and our business, such as our website hosting provider and our email delivery provider, and only
          as needed for them to perform those services for us. We may also disclose information if required by law.
        </p>
      </section>

      <section>
        <h2>Client business data</h2>
        <p>
          If your company becomes a client, any customer or estimate information you share with us is governed by
          our agreement with you. Our approach is that this information should be used only for the agreed business
          purpose, accessed only by those who need it, never sold, and not retained longer than necessary.
        </p>
      </section>

      <section>
        <h2>Retention</h2>
        <p>
          We keep call requests and related correspondence for as long as reasonably needed to respond, maintain
          ordinary business records, and meet legal obligations. You can ask us to delete your information at any time.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You may ask to access, correct, or delete the personal information we hold about you, or ask us to stop
          contacting you, by emailing <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          We use reasonable administrative and technical measures to protect the information we receive. No method of
          transmission or storage is completely secure, so we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>This website is intended for businesses and is not directed to children under 16.</p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>If we update this policy, we will post the new version here and change the date at the top of the page.</p>
      </section>

      <section>
        <h2>Contact</h2>
        <LegalContact />
      </section>
    </LegalPage>
  );
}
