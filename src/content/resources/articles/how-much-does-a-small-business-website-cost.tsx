import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Ask five web designers what a small business website costs and you may get five very different answers. That isn&apos;t
        necessarily because anyone is being unreasonable. &ldquo;A website&rdquo; can mean anything from a weekend DIY project to a
        custom-designed site with online booking, ordering, and dozens of service pages.
      </p>
      <p>
        This guide explains what actually drives the price, the common ways businesses get a website built, and how to compare
        quotes so you neither overpay nor end up with something that doesn&apos;t do its job.
      </p>

      <h2>The short answer</h2>
      <p>
        The cost depends on three things more than anything else: <strong>how much needs to be designed and built</strong>,{" "}
        <strong>who is doing the work</strong>, and <strong>what the site needs to do</strong> beyond displaying information. A
        five-page site for a local service business and a restaurant site with reservations, ordering, catering, and an events
        calendar are different projects, even if both are &ldquo;small business websites.&rdquo;
      </p>

      <h2>Common ways to get a website built</h2>
      <p>
        As a rough orientation, not a price list, quotes for small business websites tend to fall into a few broad tiers. Prices
        vary widely by region, scope, and provider.
      </p>
      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>What you typically get</th>
            <th>Main trade-off</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DIY website builder</td>
            <td>A monthly subscription and a template you customize yourself.</td>
            <td>Low cash cost, but your time, design skill, and strategy determine the result.</td>
          </tr>
          <tr>
            <td>Template set up by a freelancer</td>
            <td>A theme configured with your content, often in a few weeks.</td>
            <td>Affordable, but structure and conversion thinking vary a lot.</td>
          </tr>
          <tr>
            <td>Custom small-business site from a studio</td>
            <td>Design and structure built around your business, customers, and goals.</td>
            <td>Higher upfront cost; value depends on the quality of the thinking behind it.</td>
          </tr>
          <tr>
            <td>Larger custom builds</td>
            <td>Many pages, complex integrations, e-commerce, or custom functionality.</td>
            <td>Significant investment, appropriate only when the business needs that complexity.</td>
          </tr>
        </tbody>
      </table>

      <h2>What actually drives the price</h2>
      <h3>1. Number and type of pages</h3>
      <p>
        A homepage, about page, and contact page are quick. Ten distinct service pages, location pages, a project gallery, and a
        menu are not. Each unique page type needs design and content.
      </p>
      <h3>2. Content</h3>
      <p>
        Content is the most underestimated part of most projects. If you&apos;re providing finished text and photos, the cost is
        lower. If the designer is writing pages, organizing services, or coordinating photography, that&apos;s real work and
        should be priced as such.
      </p>
      <h3>3. Custom design versus templates</h3>
      <p>
        Templates are faster. Custom design takes longer but can be shaped around exactly how your customers make decisions.
        Neither is automatically right; it depends on how much your website needs to differentiate you.
      </p>
      <h3>4. Features and integrations</h3>
      <p>
        Quote request forms, appointment booking, reservations, online ordering, multilingual content, and connections to tools
        you already use all add scope. Many integrations also carry their own monthly software fees from the provider.
      </p>
      <h3>5. Redesign and migration work</h3>
      <p>
        Replacing an existing site involves extra care: redirecting old URLs so you don&apos;t lose search visibility, moving
        content, and changing your domain&apos;s settings without breaking your email. That&apos;s worth paying for. Getting it
        wrong can be expensive.
      </p>

      <h2>Ongoing costs to budget for</h2>
      <ul>
        <li>
          <strong>Domain name</strong>, renewed yearly. Make sure it&apos;s registered in your business&apos;s name, under an
          account you control.
        </li>
        <li>
          <strong>Hosting</strong>, which ranges from included-with-the-platform to a separate monthly or yearly fee.
        </li>
        <li>
          <strong>Software subscriptions</strong> for booking, ordering, forms, or email delivery.
        </li>
        <li>
          <strong>Maintenance and updates</strong>, either your time or a care arrangement with your developer.
        </li>
      </ul>

      <Callout title="The cheapest website isn't always the least expensive">
        A low-cost site that doesn&apos;t generate calls, bookings, or orders can cost more over time than a better one, through
        missed customers, wasted ad spend, or paying for a rebuild a year later. The right question is what the website needs to
        do for your business, and what that&apos;s worth.
      </Callout>

      <h2>How to compare website quotes</h2>
      <p>Quotes are only comparable when you know what&apos;s included. Ask each provider:</p>
      <Checklist
        items={[
          "How many pages are included, and which ones?",
          "Who writes the content, and who provides photos?",
          "Is the design custom or based on a template?",
          "Which features are included: forms, booking, ordering, galleries?",
          "Will the site be designed for mobile first?",
          "What search basics are included: page titles, sitemaps, structured data, redirects?",
          "Who owns the domain, the website, and the content when it's done?",
          "What does hosting cost after launch, and who maintains the site?",
          "How many rounds of revisions are included?",
          "How will we know if the website is working? Is analytics or conversion tracking set up?",
        ]}
      />

      <h2>Where it&apos;s worth spending, and where it isn&apos;t</h2>
      <p>
        <strong>Worth it:</strong> clear structure, a strong mobile experience, fast pages, a well-designed path to call, book, or
        order, and careful technical setup.
      </p>
      <p>
        <strong>Often not worth it:</strong> elaborate animations, features no customer asked for, and dozens of thin pages
        written only for search engines.
      </p>
      <p>
        If you&apos;re unsure what your business actually needs, start with a review of your current site, or with how your
        customers decide. Our guide on{" "}
        <Link href="/resources/website-gets-traffic-but-no-leads">why websites get traffic but no leads</Link> is a good place to
        diagnose an existing site, and our <Link href="/services">services page</Link> explains what we typically scope.
      </p>

      <ArticleCta kind="check" />
    </>
  );
}
