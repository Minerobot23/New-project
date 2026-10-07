import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Restaurant websites have a simpler job than most, and a less forgiving one. Diners usually want four things: the menu,
        the hours, the location, and a way to reserve or order. They want them on a phone, quickly, and often while already
        making plans with someone else.
      </p>
      <p>Here&apos;s what every restaurant website should include, and the common mistakes that quietly cost tables.</p>

      <h2>The essentials</h2>
      <h3>1. A menu that&apos;s an actual web page</h3>
      <p>
        A menu built as a regular web page loads fast, reads well on a phone, can be updated easily, and lets search engines see
        your dishes. A PDF does none of those things well. It&apos;s slow to download, requires zooming, and is often outdated
        because updating it is a hassle.
      </p>
      <Checklist
        items={[
          "Organized by course or category",
          "Prices included (diners look for them)",
          "Dietary notes where relevant: vegetarian, gluten-free, and so on",
          "Easy for you or your team to update",
        ]}
      />

      <h3>2. Hours that are always accurate</h3>
      <p>
        Few things frustrate a guest more than arriving to a closed door. Show today&apos;s hours prominently, list holiday hours
        when they change, and keep your website consistent with your Google Business Profile and other listings.
      </p>

      <h3>3. Location, directions, and parking</h3>
      <p>
        The address shouldn&apos;t be buried in the footer. Put it near the top, with a one-tap directions link and a note about
        parking or transit if it helps.
      </p>

      <h3>4. Reservations, one tap away</h3>
      <p>
        If you take reservations, the button should be one of the first things people see, and it should stay easy to reach as
        they scroll. Connecting your existing reservation platform so it feels like part of your site keeps guests from bouncing
        between apps.
      </p>

      <h3>5. Online ordering</h3>
      <p>
        If you offer pickup or delivery, make ordering prominent. If you have direct online ordering, consider featuring it ahead
        of third-party delivery apps so more orders come through the channel you prefer.
      </p>

      <h3>6. Photos that make people hungry</h3>
      <p>
        Real photos of your food and your space set expectations and help people picture the occasion. They should be optimized
        so they look great without slowing the page down.
      </p>

      <h2>What helps you earn more</h2>
      <ul>
        <li>
          <strong>Private dining and events:</strong> a dedicated page and inquiry form for higher-value bookings
        </li>
        <li>
          <strong>Catering:</strong> menus and a simple ordering or inquiry process
        </li>
        <li>
          <strong>Gift cards:</strong> an easy way to buy, especially around the holidays
        </li>
        <li>
          <strong>Your story:</strong> a short, genuine about section, not a three-page history
        </li>
      </ul>

      <h2>Common restaurant website mistakes</h2>
      <Checklist
        items={[
          "Large social media icons that send visitors away before they book",
          "A splash page or intro animation before the actual site",
          "Music that auto-plays",
          "Hours that contradict Google or delivery apps",
          "A reservation link hidden in a paragraph of text",
          "Huge, unoptimized images that load slowly on cellular connections",
        ]}
      />

      <Callout title="Your website and Instagram do different jobs">
        Social media is great for discovery and atmosphere. Your website is where people confirm the practical details and act.
        Read more in <Link href="/resources/website-vs-social-media">Website vs Social Media</Link>.
      </Callout>

      <h2>Designing for the phone</h2>
      <p>
        Most restaurant decisions happen on phones. On a small screen, the first things visible should be Reserve, View Menu, and
        Order Online (or whichever of those you offer), with hours and directions right below. A sticky bar that keeps the main
        action reachable while someone browses the menu is a small detail that helps.
      </p>
      <p>
        You can see these ideas in action in our interactive{" "}
        <Link href="/websites-for-restaurants#demo">restaurant concept demo</Link>, which compares a typical older restaurant
        site with a redesigned version on desktop and mobile.
      </p>

      <ArticleCta kind="simulator" href="/websites-for-restaurants#demo" />
      <ArticleCta kind="check" />
    </>
  );
}
