import Link from "next/link";
import { ArticleCta, Callout } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        &ldquo;We don&apos;t need a website, we&apos;re on Instagram.&rdquo; It&apos;s a reasonable thought. Social media is free,
        visual, and where many customers spend their time. But a social profile and a website do different jobs, and businesses
        that rely on only one usually leave gaps.
      </p>

      <h2>What social media does well</h2>
      <ul>
        <li>
          <strong>Discovery:</strong> people stumble across your work, often before they know they need you
        </li>
        <li>
          <strong>Personality:</strong> behind-the-scenes posts, your team, your space, your style
        </li>
        <li>
          <strong>Freshness:</strong> specials, new work, events, and timely updates
        </li>
        <li>
          <strong>Community:</strong> comments, messages, and shares from real customers
        </li>
      </ul>

      <h2>What a website does better</h2>
      <h3>It answers practical questions reliably</h3>
      <p>
        Menus, prices, services, hours, service areas, policies, and booking: social profiles aren&apos;t built to organize this
        information. On a website, it&apos;s always in the same place and always up to date.
      </p>
      <h3>It shows up in search</h3>
      <p>
        When someone searches for a service in your area, search engines need pages that clearly explain what you offer and
        where. A website with clear service pages gives them that. Social posts are much less effective at this.
      </p>
      <h3>You control it</h3>
      <p>
        On social platforms, the rules can change at any time: how many followers see your posts, what features are available,
        even whether your account stays active. Your website and your domain belong to your business.
      </p>
      <h3>It&apos;s built for action</h3>
      <p>
        A website can be designed around one clear next step, like calling, booking, ordering, or requesting a quote, without a
        feed of competitors and distractions next to it.
      </p>

      <Callout title="They work best together">
        Think of social media as the place people discover you, and your website as the place they decide and act. Your social
        profiles should link to your website, and your website can show off your social presence without sending visitors
        away before they take action.
      </Callout>

      <h2>How to connect the two well</h2>
      <ul>
        <li>Put your website link in every social bio, and point it to a page that matches what followers want: menu, booking, or services</li>
        <li>Keep hours and contact details consistent across both</li>
        <li>On your website, keep social links present but understated, not louder than Book or Call</li>
        <li>Use posts to drive people to specific pages, like a new service, an event, or a seasonal menu</li>
      </ul>

      <h2>When social-only can work, for a while</h2>
      <p>
        Very new businesses, pop-ups, and businesses with a tiny, loyal customer base can get by on social media alone for a time.
        But as soon as you want to be found by people who don&apos;t already follow you, or to take bookings and orders smoothly,
        a website becomes important.
      </p>
      <p>
        If you&apos;re still deciding, read{" "}
        <Link href="/resources/does-my-business-need-a-website">Does My Business Really Need a Website?</Link> or see how we
        approach <Link href="/websites-for-restaurants">restaurant</Link> and <Link href="/websites-for-salons">salon</Link>{" "}
        websites, two industries where social media plays a big role.
      </p>

      <ArticleCta kind="simulator" href="/websites-for-salons#demo" />
      <ArticleCta kind="call" />
    </>
  );
}
