export type ArticleCategory = "Planning" | "Website Strategy" | "Industry Guides";

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  readingMinutes: number;
  published: string;
  updated?: string;
};

/** Article metadata. Bodies live in ./articles/<slug>.tsx and are mapped in ./bodies.ts. */
export const ARTICLES: ArticleMeta[] = [
  {
    slug: "how-much-does-a-small-business-website-cost",
    title: "How Much Should a Small Business Website Cost?",
    description:
      "What actually drives the price of a small business website, the common ways to build one, and how to compare quotes without overpaying or under-buying.",
    category: "Planning",
    readingMinutes: 8,
    published: "2026-10-07",
  },
  {
    slug: "does-my-business-need-a-website",
    title: "Does My Business Really Need a Website?",
    description:
      "If customers already find you through referrals, Google, or social media, do you still need a website? An honest look at when it matters and when it doesn't.",
    category: "Planning",
    readingMinutes: 6,
    published: "2026-10-07",
  },
  {
    slug: "how-often-should-a-website-be-redesigned",
    title: "How Often Should a Business Website Be Redesigned?",
    description:
      "There's no fixed schedule. These are the signs that a refresh, a rebuild, or simply better upkeep is the right next step for your business website.",
    category: "Website Strategy",
    readingMinutes: 6,
    published: "2026-10-07",
  },
  {
    slug: "website-redesign-checklist",
    title: "Website Redesign Checklist for Small Businesses",
    description:
      "A practical checklist for planning, building, and launching a website redesign without losing search traffic, email, or the parts of your site that already work.",
    category: "Website Strategy",
    readingMinutes: 9,
    published: "2026-10-07",
  },
  {
    slug: "what-makes-a-good-contractor-website",
    title: "What Makes a Good Contractor Website?",
    description:
      "How homeowners actually choose a contractor online, and the pages, proof, and features that make a contractor website earn estimate requests.",
    category: "Industry Guides",
    readingMinutes: 8,
    published: "2026-10-07",
  },
  {
    slug: "what-should-a-restaurant-website-include",
    title: "What Should a Restaurant Website Include?",
    description:
      "The essentials every restaurant website needs, from a readable menu and hours to reservations and ordering, plus the common mistakes that cost tables.",
    category: "Industry Guides",
    readingMinutes: 7,
    published: "2026-10-07",
  },
  {
    slug: "how-to-turn-website-visitors-into-calls",
    title: "How to Turn More Website Visitors Into Calls",
    description:
      "Practical changes that make it easier for website visitors to call, book, or request a quote, and how to tell whether they're working.",
    category: "Website Strategy",
    readingMinutes: 8,
    published: "2026-10-07",
  },
  {
    slug: "website-gets-traffic-but-no-leads",
    title: "Why Your Business Website Gets Traffic But No Leads",
    description:
      "If people are visiting but not calling or filling out forms, the problem is usually one of a handful of fixable issues. Here's how to diagnose it.",
    category: "Website Strategy",
    readingMinutes: 7,
    published: "2026-10-07",
  },
  {
    slug: "website-vs-social-media",
    title: "Website vs Social Media: Why Businesses Need Both",
    description:
      "Social media and a website do different jobs. How they work together, and why relying only on a social profile leaves gaps for customers and for search.",
    category: "Planning",
    readingMinutes: 6,
    published: "2026-10-07",
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    title: "How Long Does It Take to Build a Business Website?",
    description:
      "Realistic timelines for small business websites and redesigns, what slows projects down, and how to keep yours on schedule.",
    category: "Planning",
    readingMinutes: 6,
    published: "2026-10-07",
  },
];

export const getArticle = (slug: string) => ARTICLES.find((article) => article.slug === slug);
