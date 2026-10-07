import Link from "next/link";
import { ArticleCta, Callout, Checklist } from "@/components/resources/article-parts";

export default function Article() {
  return (
    <>
      <p>
        Homeowners don&apos;t hire contractors the way they buy most things. The projects are expensive, personal, and
        disruptive, and a bad choice is hard to undo. So they research, compare, and look for reasons to trust, or to rule
        someone out.
      </p>
      <p>
        A good contractor website is built for exactly that process. Here&apos;s what it needs, whether you&apos;re a remodeler,
        roofer, HVAC company, plumber, electrician, or landscaper.
      </p>

      <h2>1. Make it instantly clear what you do and where</h2>
      <p>
        Within a few seconds, a homeowner should know what type of work you do, roughly what scale of projects you take on, and
        whether you work in their area. A vague headline like &ldquo;Quality You Can Trust&rdquo; tells them none of that.
      </p>

      <h2>2. Show your work, organized the way homeowners browse</h2>
      <p>
        Photos are often the single biggest factor. Homeowners want to see work similar to what they&apos;re planning. A gallery
        organized by project type (kitchens, baths, roofing, decks) is far more useful than a single scrolling wall of images.
      </p>
      <Checklist
        items={[
          "Recent projects, with the most impressive and most typical work up front",
          "Before-and-after pairs where you have them",
          "A short caption: the project type, the town, and anything notable",
          "Images optimized so the gallery loads quickly on a phone",
        ]}
      />

      <h2>3. Give each major service its own page</h2>
      <p>
        Someone researching a basement finish and someone researching a roof replacement are looking for different things.
        Dedicated pages let you explain the scope, process, and typical timeline for each, and they give search engines clearer
        signals about what you do.
      </p>

      <h2>4. Explain your process</h2>
      <p>
        Uncertainty is one of the biggest reasons homeowners hesitate. A simple explanation of what happens after they reach out
        (consultation, estimate, scheduling, the work itself, cleanup, final walkthrough) makes taking the first step feel safer.
      </p>

      <h2>5. Put trust signals where decisions happen</h2>
      <ul>
        <li>License and insurance information, stated clearly</li>
        <li>Real customer reviews, ideally mentioning the type of project</li>
        <li>Warranty details, in plain language</li>
        <li>Real photos of your team and trucks, if you&apos;re comfortable sharing them</li>
        <li>Any memberships or certifications you genuinely hold</li>
      </ul>
      <Callout title="Never fake trust">
        Invented reviews, borrowed photos, or certifications you don&apos;t hold are easy to spot and can do serious damage. A
        newer company is better served by honest, specific information and great presentation.
      </Callout>

      <h2>6. Make requesting an estimate easy, and useful for you</h2>
      <p>
        A generic &ldquo;name, email, message&rdquo; form produces vague inquiries. A well-designed estimate request asks just
        enough to help you respond well:
      </p>
      <Checklist
        items={[
          "Project type (a simple dropdown or buttons)",
          "Town or ZIP code",
          "Rough timeline",
          "Optional budget range, if that helps you qualify projects",
          "Optional photo upload",
        ]}
      />
      <p>
        Keep it short. Every extra field reduces completions, so only ask for what you&apos;ll actually use.
      </p>

      <h2>7. Design for the phone first</h2>
      <p>
        Many homeowners browse contractors on their phones in the evening. Swipeable galleries, a visible call button, and a
        short form that works with a thumb make a real difference.
      </p>

      <h2>8. Make your service area obvious</h2>
      <p>
        List the towns or counties you serve. If you serve a wide area, a few genuinely useful location pages for your core
        markets can help, but avoid dozens of near-identical town pages.
      </p>

      <h2>What a contractor website doesn&apos;t need</h2>
      <ul>
        <li>Long &ldquo;about us&rdquo; histories on the homepage</li>
        <li>Auto-playing video or slideshows that slow the page down</li>
        <li>Stock photos of smiling models in hard hats</li>
        <li>Pop-ups that interrupt someone who&apos;s already interested</li>
      </ul>

      <p>
        You can see how these ideas come together in our{" "}
        <Link href="/websites-for-contractors">contractor website</Link>,{" "}
        <Link href="/websites-for-roofers">roofing</Link>, and <Link href="/websites-for-hvac-companies">HVAC</Link> pages.
      </p>

      <ArticleCta kind="simulator" href="/websites-for-hvac-companies#demo" />
      <ArticleCta kind="check" />
    </>
  );
}
