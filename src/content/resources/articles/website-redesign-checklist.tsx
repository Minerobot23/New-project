import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        A redesign is a chance to fix what isn&apos;t working, but it&apos;s also a chance to accidentally break what is: search
        visibility, working contact forms, even your company email. This checklist covers the steps that matter, in the order
        they matter.
      </p>

      <h2>1. Before you start: goals and baseline</h2>
      <Checklist
        items={[
          <>
            <strong>Write down what the website should do.</strong> More estimate requests? More reservations? Fewer &ldquo;what
            are your hours&rdquo; calls? Specific goals shape every later decision.
          </>,
          <>
            <strong>Record where you are today.</strong> If you have analytics, note monthly visitors, top pages, and how many
            calls or form submissions come in. Even rough numbers give you something to compare against.
          </>,
          <>
            <strong>Identify your most important pages.</strong> Pages that bring in search traffic or leads need special care
            during the move.
          </>,
          <>
            <strong>Ask a few customers</strong> how they found you and what they looked for. Their answers are often more useful
            than any audit.
          </>,
        ]}
      />

      <h2>2. Gather access before anything changes</h2>
      <Callout title="This step prevents most launch-day emergencies">
        Many businesses don&apos;t know who controls their domain, or that their email depends on settings stored in the same
        place as their website&apos;s. Find out before you change anything.
      </Callout>
      <Checklist
        items={[
          "Domain registrar login (where you bought your domain name), in your own business's name",
          "DNS access, if it's managed somewhere other than the registrar",
          "Current website platform or hosting login",
          "Google Business Profile access",
          "Analytics and Google Search Console access, if they exist",
          "Logins for booking, ordering, or form tools the site uses",
          "A record of your current email-related DNS records (MX, SPF, DKIM, DMARC), so they're preserved",
        ]}
      />

      <h2>3. Plan the new structure</h2>
      <Checklist
        items={[
          "List every page on the current site, and decide whether each one stays, merges, or goes",
          "Organize services or offerings the way customers think about them",
          "Decide on the primary action for each important page",
          "Plan the mobile experience first, not as an afterthought",
          "Map every old URL that's changing to its new URL, for redirects",
        ]}
      />

      <h2>4. Content and design</h2>
      <Checklist
        items={[
          "Update every fact: services, prices, hours, service areas, team, credentials",
          "Replace outdated photos with real, recent ones where possible",
          "Write page titles and meta descriptions for each page",
          "Add descriptive alt text to meaningful images",
          "Keep calls-to-action specific, like \"Request an Estimate\" rather than \"Submit\"",
        ]}
      />

      <h2>5. Before launch: test everything</h2>
      <Checklist
        items={[
          "Submit every form and confirm the notification actually arrives",
          "Tap every phone number and email link on a real phone",
          "Test booking, reservation, and ordering flows end to end",
          "Check every page on a phone, a tablet, and a desktop",
          "Check page speed, especially on mobile",
          "Confirm analytics and conversion tracking are recording",
          "Check for broken links and missing images",
        ]}
      />

      <h2>6. Launch day</h2>
      <Checklist
        items={[
          "Change only the DNS records the new site needs, and leave email records untouched",
          "Turn on 301 redirects from old URLs to new ones",
          "Confirm HTTPS works on both the main domain and www",
          "Submit the new sitemap in Google Search Console",
          "Update the website link on your Google Business Profile and social profiles if it changed",
          "Send yourself a test email to confirm email still works",
        ]}
      />

      <h2>7. The first few weeks</h2>
      <Checklist
        items={[
          "Watch Search Console for crawl errors and pages that aren't found",
          "Compare calls, form submissions, and bookings with your baseline",
          "Fix anything customers mention: confusion is feedback",
          "Expect some search fluctuation after a redesign; well-planned redirects keep it limited",
        ]}
      />

      <p>
        Not sure whether you need a redesign at all? Start with{" "}
        <Link href="/resources/how-often-should-a-website-be-redesigned">how often a website should be redesigned</Link>, or see
        what we include in a <Link href="/services">redesign project</Link>.
      </p>

      <ArticleCta kind="call" />
    </>
  );
}
