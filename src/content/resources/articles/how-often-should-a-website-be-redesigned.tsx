import Link from "next/link";
import { ArticleCta, Callout } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        You&apos;ll often hear a rule of thumb that websites should be redesigned every few years. It&apos;s not a bad
        reminder, but a calendar is a poor way to decide. Some websites stay effective for years with good upkeep; others are
        out of step with the business within months.
      </p>
      <p>A better question is: is your website still doing its job? Here&apos;s how to tell.</p>

      <h2>Redesign, refresh, or maintain?</h2>
      <p>Not every problem needs a full redesign. There are really three different options:</p>
      <ul>
        <li>
          <strong>Maintain:</strong> keep content, hours, photos, and software current. This is ongoing and should happen
          regardless.
        </li>
        <li>
          <strong>Refresh:</strong> improve specific pages, calls-to-action, photos, or speed without rebuilding everything.
          Useful when the foundation is sound but some parts underperform.
        </li>
        <li>
          <strong>Redesign:</strong> rethink structure, design, and technology. Right when the foundation itself is the problem.
        </li>
      </ul>

      <h2>Signs it&apos;s time for a redesign</h2>
      <h3>It doesn&apos;t work well on phones</h3>
      <p>
        If visitors have to pinch and zoom, tap tiny links, or scroll sideways, that&apos;s a structural problem. It usually
        can&apos;t be patched into a site that was never designed for mobile.
      </p>
      <h3>It&apos;s slow</h3>
      <p>
        Slow sites lose impatient visitors. Sometimes speed can be fixed with optimization; sometimes the platform or theme is
        the bottleneck.
      </p>
      <h3>Your business has changed</h3>
      <p>
        New services, a new location, a shift toward bigger projects, a change in who you want as customers. If your website
        describes the business you were, it&apos;s working against the business you are.
      </p>
      <h3>You can&apos;t update it</h3>
      <p>
        If changing your hours requires calling someone who no longer answers, or logging into a platform nobody remembers, the
        website will drift out of date. That costs trust.
      </p>
      <h3>Visitors aren&apos;t taking action</h3>
      <p>
        If you&apos;re getting traffic but few calls, bookings, or requests, the problem may be structure and clarity rather than
        visibility. See <Link href="/resources/website-gets-traffic-but-no-leads">why websites get traffic but no leads</Link>.
      </p>
      <h3>You&apos;re reluctant to share it</h3>
      <p>
        This one is surprisingly reliable. If you hesitate before giving someone your website address, your customers probably
        notice the same things you do.
      </p>

      <Callout title="Don't redesign just to change the look">
        A redesign that only changes colors and fonts rarely moves the needle. The best redesigns start from how customers make
        decisions and what you want them to do, then design around that.
      </Callout>

      <h2>Signs it probably isn&apos;t time yet</h2>
      <ul>
        <li>The site works well on phones and loads quickly</li>
        <li>Customers regularly mention finding you through the website</li>
        <li>Calls, bookings, or requests come through it consistently</li>
        <li>You can easily keep it up to date</li>
      </ul>
      <p>In that case, targeted improvements and good maintenance are usually the better investment.</p>

      <h2>Planning a redesign</h2>
      <p>
        If you decide it&apos;s time, plan carefully, especially around search visibility and your domain&apos;s email settings.
        Our <Link href="/resources/website-redesign-checklist">website redesign checklist</Link> walks through the whole process.
      </p>

      <ArticleCta kind="simulator" />
      <ArticleCta kind="check" />
    </>
  );
}
