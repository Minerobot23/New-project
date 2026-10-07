import Link from "next/link";
import { LegalContact, LegalPage } from "@/components/legal/legal-page";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms governing use of the Fluxline Solutions website, fluxlinesolutions.com, operated by Fluxline LLC.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <section>
        <p>
          These terms govern your use of {site.domain} (the &quot;website&quot;), operated by {site.legalName}{" "}
          (&quot;Fluxline,&quot; &quot;we,&quot; or &quot;us&quot;). By using the website, you agree to these terms.
        </p>
      </section>

      <section>
        <h2>About the website</h2>
        <p>
          The website describes Fluxline Solutions&apos; services and lets businesses request a call. Its content is general
          information, not professional, legal, or financial advice, and it is not an offer to provide services on
          any particular terms.
        </p>
      </section>

      <section>
        <h2>Services and results</h2>
        <p>
          Any services Fluxline provides are governed by a separate written agreement with the client. Business outcomes
          depend on many factors outside our control, and we do not guarantee search rankings, traffic, leads, sales, or
          other specific results.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <p>When using the website, you agree not to:</p>
        <ul>
          <li>Submit false information or requests on behalf of someone else without permission.</li>
          <li>Send spam or use automated means to submit forms or scrape the website.</li>
          <li>Attempt to interfere with the website&apos;s security or operation.</li>
          <li>Use the website for any unlawful purpose.</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual property</h2>
        <p>
          The website&apos;s content, including text, design, and the Fluxline name, belongs to {site.legalName}. You
          may view and share pages for ordinary business purposes, but may not copy or reuse the content commercially
          without our permission.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          Our <Link href="/privacy">Privacy Policy</Link> explains how we handle information submitted through the
          website.
        </p>
      </section>

      <section>
        <h2>Disclaimers</h2>
        <p>
          The website is provided &quot;as is&quot; and &quot;as available.&quot; To the extent permitted by law, we
          disclaim all warranties, express or implied, including warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that the website will be uninterrupted or
          error-free.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, {site.legalName} will not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising from your use of the website.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. The current version will always be posted on this page with
          its effective date.
        </p>
      </section>

      <section>
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the state in which {site.legalName} is organized, without regard to
          conflict-of-law principles.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <LegalContact />
      </section>
    </LegalPage>
  );
}
