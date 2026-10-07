import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Your analytics show people visiting your website, but the phone isn&apos;t ringing and the contact form is quiet. It&apos;s
        a frustrating spot, and a common one. The good news: the cause is usually one of a handful of fixable problems.
      </p>
      <p>Work through these in order. The first two are the most often overlooked.</p>

      <h2>1. Make sure leads aren&apos;t getting lost</h2>
      <p>
        Before assuming nobody is reaching out, confirm that the ways they reach out actually work. It sounds obvious, but
        broken forms are more common than you&apos;d think.
      </p>
      <Checklist
        items={[
          "Submit your own contact form and confirm the email arrives (check spam too)",
          "Tap your phone number on a real phone",
          "Test booking or reservation links end to end",
          "Make sure notifications go to an inbox someone actually checks",
        ]}
      />

      <h2>2. Check whether you&apos;re measuring the right things</h2>
      <p>
        Many leads never touch a form. Someone reads your site, then calls you directly, or visits in person. If you only count
        form submissions, the website may be doing more than you think. Track phone link taps, and ask new customers how they
        found you.
      </p>

      <h2>3. Look at who the traffic actually is</h2>
      <p>
        Not all traffic is equal. Visitors from outside your service area, people searching for something you don&apos;t offer,
        or automated bot traffic all inflate numbers without producing leads. Check which pages people land on, where they
        come from, and what they searched for if you can see it in Google Search Console.
      </p>

      <h2>4. Test the mobile experience honestly</h2>
      <p>
        Many visitors are on phones. If they have to zoom, hunt for your phone number, or fight a pop-up, many will leave. View
        your site on your own phone and try to do the thing you want customers to do.
      </p>

      <h2>5. Is it clear what you do, for whom, and where?</h2>
      <p>
        Visitors decide quickly whether they&apos;re in the right place. A generic headline, services buried in paragraphs, or an
        unclear service area all create doubt. Clear, specific language beats clever slogans.
      </p>

      <h2>6. Is the next step obvious on every page?</h2>
      <p>
        If the only call-to-action is &ldquo;Contact Us&rdquo; at the bottom of the page, many visitors never get there. Each
        important page should have a specific, visible next step: call, request a quote, book, reserve, or order.
      </p>

      <h2>7. Are you answering the questions that stop people?</h2>
      <p>
        Price uncertainty, unclear availability, and missing trust signals are common reasons people leave without acting. You
        don&apos;t need to publish exact prices, but ranges, &ldquo;starting at&rdquo; pricing, or an explanation of how pricing
        works can remove a major barrier.
      </p>

      <h2>8. Is the site fast enough?</h2>
      <p>
        Slow pages lose visitors before they see anything. Large images and heavy page builders are frequent culprits.
      </p>

      <Callout title="One change at a time">
        When you make improvements, change one significant thing at a time where possible and give it a few weeks. That&apos;s
        the only way to learn what actually made a difference for your business.
      </Callout>

      <h2>When to consider a redesign</h2>
      <p>
        If the problems are structural, like a site that was never designed for mobile, a confusing page structure, or a
        platform you can&apos;t update, small fixes may not be enough. See{" "}
        <Link href="/resources/how-often-should-a-website-be-redesigned">how often a website should be redesigned</Link> and our{" "}
        <Link href="/resources/how-to-turn-website-visitors-into-calls">guide to turning visitors into calls</Link>.
      </p>

      <ArticleCta kind="check" />
      <ArticleCta kind="call" />
    </>
  );
}
