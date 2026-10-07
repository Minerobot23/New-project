import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Most small business websites take a few weeks to a couple of months from first conversation to launch. That&apos;s a
        wide range, and where your project lands depends less on the technology than on scope, content, and how quickly
        decisions get made.
      </p>
      <p>Here&apos;s what a typical project looks like, what slows things down, and how to keep yours moving.</p>

      <h2>A typical timeline</h2>
      <p>
        These are realistic estimates for a focused small-business website. Larger sites, complex integrations, or extensive
        content writing take longer.
      </p>
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>What happens</th>
            <th>Typical length</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Discovery</td>
            <td>Goals, customers, services, current site review, and scope</td>
            <td>A few days to a week</td>
          </tr>
          <tr>
            <td>Content</td>
            <td>Gathering or writing page content, photos, and details</td>
            <td>Often the longest and most variable phase</td>
          </tr>
          <tr>
            <td>Design</td>
            <td>Layout and visual design, starting with key pages, with your feedback</td>
            <td>One to a few weeks</td>
          </tr>
          <tr>
            <td>Build</td>
            <td>Development, integrations, forms, and responsive testing</td>
            <td>One to a few weeks</td>
          </tr>
          <tr>
            <td>Review &amp; launch</td>
            <td>Testing, final changes, domain setup, redirects, and going live</td>
            <td>A few days to a week</td>
          </tr>
        </tbody>
      </table>
      <p>Some phases overlap. Content gathering often continues while design is underway.</p>

      <h2>What slows projects down</h2>
      <h3>Content</h3>
      <p>
        Waiting on text, photos, prices, or service details is the most common cause of delay. If content is your bottleneck,
        consider having your web designer write it from a conversation with you. Many owners find it faster to talk than to
        write.
      </p>
      <h3>Feedback delays</h3>
      <p>
        A week waiting for feedback on a design adds a week to the project. Agreeing on review dates up front helps.
      </p>
      <h3>Too many decision-makers</h3>
      <p>
        When several partners or family members each need to approve every detail, decide early who has final say.
      </p>
      <h3>Access and accounts</h3>
      <p>
        Launch can stall when nobody knows who controls the domain, or when booking and ordering tools aren&apos;t set up yet.
        Gather these logins early. Our{" "}
        <Link href="/resources/website-redesign-checklist">redesign checklist</Link> has a full list.
      </p>
      <h3>Scope creep</h3>
      <p>
        New ideas mid-project are natural. Deciding whether they belong in this launch or a later phase keeps the timeline
        intact.
      </p>

      <Callout title="Launching a solid first version beats waiting for perfect">
        A focused website that launches on time and gets improved over the following months usually serves a business better
        than a larger one that&apos;s stuck in revisions.
      </Callout>

      <h2>How to keep your project on schedule</h2>
      <Checklist
        items={[
          "Agree on scope, timeline, and review dates before work begins",
          "Decide who gives final approval",
          "Gather domain, hosting, and tool logins early",
          "Start collecting photos and service details right away",
          "Plan launch around your slower season if your business is seasonal",
          "Keep a \"phase two\" list for good ideas that come up mid-project",
        ]}
      />

      <p>
        Budget planning goes hand in hand with timing. See{" "}
        <Link href="/resources/how-much-does-a-small-business-website-cost">how much a small business website should cost</Link>.
      </p>

      <ArticleCta kind="call" />
    </>
  );
}
