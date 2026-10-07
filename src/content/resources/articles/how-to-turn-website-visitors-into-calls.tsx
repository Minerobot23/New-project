import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        For many local businesses, a phone call is the most valuable thing a website can produce. A caller is usually ready to
        talk, ready to book, and easier to convert than an anonymous visitor. Yet many websites make calling surprisingly hard.
      </p>
      <p>
        Here are practical changes that make it easier for interested visitors to call, plus ways to check whether they&apos;re
        working. None of them are tricks; they simply remove friction for people who already want to reach you.
      </p>

      <h2>1. Make the phone number impossible to miss</h2>
      <p>
        Put your number in the header of every page, not just the contact page. On desktop, show it as text. On phones, make it
        a large, tappable button.
      </p>
      <Checklist
        items={[
          "Phone number in the header on every page",
          "On mobile, a tap-to-call button rather than plain text",
          "Large enough to tap easily with a thumb",
          "High contrast so it stands out from the navigation",
        ]}
      />

      <h2>2. Keep the call button within reach on mobile</h2>
      <p>
        A sticky bar at the bottom of the screen, with Call and the main secondary action (Book, Request a Quote, Get Directions),
        keeps the next step one tap away as visitors scroll. It&apos;s one of the most effective small changes for phone-heavy
        businesses.
      </p>

      <h2>3. Tell people what to call about</h2>
      <p>
        &ldquo;Call us&rdquo; is fine. &ldquo;Call for same-day service&rdquo; or &ldquo;Call to schedule a free estimate&rdquo;
        is better. Specific calls-to-action set expectations and give hesitant visitors a reason to pick up the phone now.
      </p>

      <h2>4. Set expectations about availability</h2>
      <p>
        If you answer 24/7, say so. If calls after 6 p.m. go to voicemail and get returned the next morning, say that too.
        Honest expectations reduce hang-ups and frustration, and an emergency-service message can be the deciding factor for
        urgent visitors.
      </p>

      <h2>5. Put reassurance next to the call-to-action</h2>
      <p>
        Right before someone calls, they often hesitate: are these people any good? A short line of reassurance near the button,
        such as reviews, licensing, or &ldquo;no-obligation estimates,&rdquo; addresses that moment directly.
      </p>

      <h2>6. Offer an alternative for people who won&apos;t call</h2>
      <p>
        Some people won&apos;t call, especially outside business hours or at work. A short request form or online booking
        captures them instead of losing them. Keep it brief: name, phone, what they need, and maybe a preferred time.
      </p>

      <h2>7. Make the page fast</h2>
      <p>
        If the page takes too long to load on a phone, the visitor may never see your number at all. Optimized images, lean
        code, and modern hosting matter more than most visual flourishes.
      </p>

      <h2>8. Remove distractions</h2>
      <p>
        Pop-ups, auto-playing videos, and big social media buttons all compete with the action you actually want. Each one is
        a chance for an interested visitor to get sidetracked.
      </p>

      <Callout title="How to tell if it's working">
        Track phone link taps and form submissions as conversions in your analytics. If you use call-tracking numbers, use them
        carefully: your main business number should stay consistent across your website and listings, which matters for local
        search. Most importantly, ask new callers how they found you.
      </Callout>

      <h2>A quick self-test</h2>
      <p>Pull out your phone and visit your own website as if you were a customer:</p>
      <Checklist
        items={[
          "Can you find the phone number within two seconds?",
          "Can you call with one tap?",
          "Is it clear what you should call about?",
          "Is it still easy to call after scrolling halfway down a page?",
          "Do you know whether anyone will answer right now?",
        ]}
      />
      <p>
        If any answer is no, there&apos;s an easy improvement waiting. If visitors are coming but still not calling, read{" "}
        <Link href="/resources/website-gets-traffic-but-no-leads">why websites get traffic but no leads</Link>.
      </p>

      <ArticleCta kind="simulator" href="/websites-for-hvac-companies#demo" />
      <ArticleCta kind="check" />
    </>
  );
}
