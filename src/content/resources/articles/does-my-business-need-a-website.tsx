import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Plenty of good businesses run on referrals, repeat customers, and a busy social media account. So it&apos;s a fair
        question: if customers already find you, do you really need a website?
      </p>
      <p>
        For most businesses, the honest answer is yes, though not always the large, complicated website people imagine. Here&apos;s
        why, and what &ldquo;enough&rdquo; actually looks like.
      </p>

      <h2>Customers check you out before they contact you</h2>
      <p>
        Even when a friend recommends you, many people look you up before they call. They want to confirm you&apos;re real, see
        what you offer, check your hours or service area, and get a feel for whether you&apos;re the right fit.
      </p>
      <p>
        If that search turns up nothing, or only an outdated listing, some of them will quietly move on. You&apos;ll never know
        they were interested.
      </p>

      <h2>Social media and listings are rented space</h2>
      <p>
        Social platforms, review sites, and marketplaces are useful, but you don&apos;t control them. Algorithms change, accounts
        get restricted, features come and go, and competitors appear right next to your profile. A website is the one place
        online where you decide what customers see and what they can do next.
      </p>
      <p>
        We cover this in more depth in{" "}
        <Link href="/resources/website-vs-social-media">Website vs Social Media: Why Businesses Need Both</Link>.
      </p>

      <h2>Search engines need something to show</h2>
      <p>
        When someone searches for a service in your area, search engines look for pages that clearly explain who offers it and
        where. A website with clear service pages and accurate business information gives them something solid to show. Without
        one, you&apos;re relying entirely on listings and on other sites mentioning you.
      </p>

      <h2>A website answers questions while you&apos;re busy</h2>
      <p>
        Hours, prices, menus, service areas, booking: if customers can find answers themselves at 10 p.m., you spend less time
        on the phone answering the same questions, and more of the customers who do call are ready to buy.
      </p>

      <Callout title="When a big website isn't necessary">
        If you&apos;re fully booked through referrals and don&apos;t want more work, you may not need much. Even then, a simple,
        professional page with what you do, where you work, and how to reach you protects your credibility when someone does look
        you up.
      </Callout>

      <h2>What &ldquo;enough&rdquo; looks like for most small businesses</h2>
      <p>A focused website that does its job usually includes:</p>
      <Checklist
        items={[
          "A clear statement of what you do and who you serve, at the top of the homepage",
          "Your services, menu, or offerings, organized the way customers think about them",
          "Hours, location or service area, and contact details that are always accurate",
          "Proof: real photos, reviews, credentials, or examples of your work",
          "One obvious next step, whether that's call, book, order, reserve, or request a quote",
          "A layout designed for phones first",
        ]}
      />
      <p>
        That might be five pages or fifty, depending on your business. Restaurants and contractors, for example, need different
        things. See our guides to <Link href="/websites-for-restaurants">restaurant websites</Link> and{" "}
        <Link href="/websites-for-contractors">contractor websites</Link>.
      </p>

      <h2>Signs your current setup isn&apos;t enough</h2>
      <ul>
        <li>Customers regularly call to ask questions your website (or profile) should answer</li>
        <li>You&apos;re hesitant to share your website link because of how it looks</li>
        <li>Competitors with weaker reputations look more established online</li>
        <li>You rely on one platform you don&apos;t control for most new customers</li>
      </ul>

      <ArticleCta kind="simulator" />
      <p>
        If you already have a website and aren&apos;t sure whether it&apos;s pulling its weight, we&apos;re happy to take a look.
      </p>
      <ArticleCta kind="check" />
    </>
  );
}
