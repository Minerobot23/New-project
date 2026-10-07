import type { Faq } from "@/components/ui/faq-list";

export type LocationPage = {
  path: string;
  place: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  communities: string[];
  focusIndustries: string[];
  faqs: Faq[];
};

const remoteFaq: Faq = {
  q: "Do you have an office in my area?",
  a: "We don't claim offices we don't have. Most of our work happens by phone, video call, and email, which keeps projects efficient for busy owners. If meeting in person matters to you, mention it when you request a call.",
};

export const LOCATION_PAGES: Record<string, LocationPage> = {
  "long-island": {
    path: "/web-design-long-island",
    place: "Long Island",
    metaTitle: "Web Design for Long Island Businesses",
    metaDescription:
      "Website design for Long Island businesses in Nassau and Suffolk County: mobile-first, conversion-focused websites for contractors, restaurants, salons, auto shops, and local businesses.",
    h1: "Web design for Long Island businesses.",
    intro:
      "Fluxline Solutions designs modern, mobile-first websites for businesses across Nassau and Suffolk County, built to turn local searches into calls, bookings, reservations, and visits.",
    sections: [
      {
        heading: "Why Long Island websites need to work harder",
        paragraphs: [
          "Long Island customers have plenty of options. A homeowner in need of a plumber, a family choosing a restaurant for Saturday night, or a commuter looking for a mechanic near the train station can compare several businesses in a few minutes on a phone.",
          "In that comparison, your website is often the deciding factor. It isn't about having the flashiest design. It's about answering questions quickly and making the next step obvious.",
        ],
      },
      {
        heading: "Seasonality is part of the plan",
        paragraphs: [
          "Many Long Island businesses feel the seasons sharply. HVAC companies get the heat-wave rush, roofers get storm season, landscapers and pool companies have spring openings, and East End restaurants and shops run on summer hours.",
          "A good website plans for that: seasonal hours that are easy to update, service pages that match what people search for at different times of year, and calls-to-action that reflect what customers need right now.",
        ],
      },
      {
        heading: "Service areas matter on an island of towns",
        paragraphs: [
          "Long Island is a patchwork of villages, hamlets, and towns, and customers often search with a town name. Service businesses that cover many communities benefit from clearly showing where they work, with a small number of genuinely useful location pages rather than hundreds of near-identical ones.",
        ],
        bullets: [
          "Clear service-area information on every relevant page",
          "Business details that match your Google Business Profile",
          "Location pages only where they add real value for customers",
        ],
      },
    ],
    communities: ["Nassau County", "Suffolk County", "the North Shore", "the South Shore", "the East End"],
    focusIndustries: ["/websites-for-hvac-companies", "/websites-for-contractors", "/websites-for-restaurants", "/websites-for-local-businesses"],
    faqs: [
      remoteFaq,
      {
        q: "Do you only work with Long Island businesses?",
        a: "No. We serve businesses throughout Long Island and Queens and work with businesses elsewhere too.",
      },
      {
        q: "Can you help us show up for searches in specific towns?",
        a: "We build the structure that supports local search: clear service areas, useful location pages, consistent business details, and fast, mobile-friendly pages. No one can honestly guarantee rankings, but these fundamentals matter.",
      },
      {
        q: "We're busiest in summer. When should we redesign?",
        a: "Ideally in your slower season, so the new site is ready before demand picks up. We'll plan the timeline around your calendar.",
      },
    ],
  },

  "nassau-county": {
    path: "/web-design-nassau-county",
    place: "Nassau County",
    metaTitle: "Web Design for Nassau County Businesses",
    metaDescription:
      "Website design for Nassau County businesses: fast, mobile-first websites for contractors, restaurants, salons, auto repair shops, and professional services competing in dense local markets.",
    h1: "Web design for Nassau County businesses.",
    intro:
      "Nassau County is dense, competitive, and close to the city. Customers expect a lot and compare quickly. Fluxline designs websites that help Nassau businesses stand out where it counts: on a phone, in a search result, in the first few seconds.",
    sections: [
      {
        heading: "Competing in dense local markets",
        paragraphs: [
          "Many Nassau communities have several restaurants, salons, contractors, or auto shops within a short drive of each other. When customers can easily compare, small differences matter: whether your hours are easy to find, whether booking takes one tap or five, whether your site looks as established as your business really is.",
        ],
      },
      {
        heading: "Village downtowns and main streets",
        paragraphs: [
          "Nassau's village downtowns are full of independent restaurants, cafés, boutiques, and service businesses. For these businesses, a website has to do practical work: show the menu or products, give accurate hours, explain parking, and get people through the door.",
        ],
        bullets: [
          "Accurate hours, including holidays and special events",
          "Directions and parking information for downtown locations",
          "Reservations, orders, and bookings that work smoothly on a phone",
        ],
      },
      {
        heading: "Home services in established neighborhoods",
        paragraphs: [
          "Much of Nassau's housing has been around for decades, which keeps HVAC, plumbing, roofing, and remodeling companies busy. Homeowners researching a renovation or a system replacement want to see proof of quality, understand the process, and request an estimate without friction.",
        ],
      },
    ],
    communities: ["Garden City", "Mineola", "Hempstead", "Freeport", "Long Beach", "Great Neck", "Manhasset", "Massapequa", "Hicksville", "Rockville Centre"],
    focusIndustries: ["/websites-for-restaurants", "/websites-for-salons", "/websites-for-contractors", "/websites-for-plumbers"],
    faqs: [
      remoteFaq,
      {
        q: "Our customers come from a few nearby towns. Do we need location pages?",
        a: "Often not. Clear service-area information on your main pages may be enough. Location pages make sense when you have something genuinely specific to say about each area.",
      },
      {
        q: "Can you work with our existing booking or ordering system?",
        a: "Usually, yes. We integrate the platforms you already use so they feel like part of your website.",
      },
      {
        q: "How do we compete with bigger businesses nearby?",
        a: "Independent businesses can win on clarity, personality, and convenience. A fast, well-organized website that makes the next step easy helps you compete on more than ad budget.",
      },
    ],
  },

  "suffolk-county": {
    path: "/web-design-suffolk-county",
    place: "Suffolk County",
    metaTitle: "Web Design for Suffolk County Businesses",
    metaDescription:
      "Website design for Suffolk County businesses, from western Suffolk to the East End: mobile-first websites built for wide service areas, seasonal demand, and visitors planning ahead.",
    h1: "Web design for Suffolk County businesses.",
    intro:
      "Suffolk County stretches from busy western towns to the farms, wineries, and beach communities of the East End. Businesses here often serve wide areas and seasonal crowds, and their websites need to handle both.",
    sections: [
      {
        heading: "Wide service areas",
        paragraphs: [
          "Contractors, HVAC companies, landscapers, and other service businesses in Suffolk often cover long distances. Customers want to know quickly whether you serve their town, and how soon you can get there.",
        ],
        bullets: [
          "Service-area information that's easy to find and easy to understand",
          "Request forms that capture location up front",
          "Clear expectations about scheduling and response times",
        ],
      },
      {
        heading: "Seasonal and visitor-driven businesses",
        paragraphs: [
          "On the East End especially, many restaurants, shops, and hospitality businesses depend on summer visitors and second-home owners. Those customers often plan from somewhere else, sometimes weeks ahead, and rely entirely on your website for hours, reservations, and directions.",
          "That means seasonal hours that are always accurate, reservations that are easy to make far in advance, and clear directions for people who don't know the area.",
        ],
      },
      {
        heading: "Mobile, everywhere",
        paragraphs: [
          "Whether it's a homeowner checking on a contractor from a job site or a visitor searching for lunch near the beach, Suffolk customers are frequently on phones, sometimes on spotty connections. Fast, lightweight pages aren't a luxury; they're the difference between being found and being skipped.",
        ],
      },
    ],
    communities: ["Huntington", "Babylon", "Islip", "Smithtown", "Brookhaven", "Riverhead", "the North Fork", "the Hamptons"],
    focusIndustries: ["/websites-for-roofers", "/websites-for-hvac-companies", "/websites-for-restaurants", "/websites-for-local-businesses"],
    faqs: [
      remoteFaq,
      {
        q: "We're a seasonal business. How do we keep hours accurate?",
        a: "We set things up so seasonal hours are simple to update, and help keep your website and Google Business Profile consistent.",
      },
      {
        q: "Many of our customers aren't local. How should our site account for that?",
        a: "Visitors need more context: clear directions, parking information, reservation policies, and what to expect when they arrive. We design for the person who has never been there before.",
      },
      {
        q: "We cover a huge area. How do we show that without spammy pages?",
        a: "Clear service-area information plus a few genuinely useful location pages for your core markets. Hundreds of near-duplicate town pages tend to help no one.",
      },
    ],
  },

  queens: {
    path: "/web-design-queens",
    place: "Queens",
    metaTitle: "Web Design for Queens Businesses",
    metaDescription:
      "Website design for Queens businesses: mobile-first websites for restaurants, salons, auto shops, contractors, and local businesses serving diverse, fast-moving neighborhoods.",
    h1: "Web design for Queens businesses.",
    intro:
      "Queens is fast-moving, dense, and remarkably diverse. Restaurants, salons, shops, auto shops, and contractors here compete block by block. Fluxline designs websites that help Queens businesses get chosen.",
    sections: [
      {
        heading: "Built for neighborhoods on the move",
        paragraphs: [
          "Queens customers are often on foot, on the train, or on a phone deciding where to go next. They want menus, prices, hours, and directions immediately, and they move on quickly when a website gets in the way.",
        ],
        bullets: [
          "One-tap calls, directions, reservations, and orders",
          "Fast pages on cellular connections",
          "Hours and location visible without scrolling",
        ],
      },
      {
        heading: "Serving a multilingual community",
        paragraphs: [
          "Queens is often described as one of the most linguistically diverse places in the world. For many businesses, serving customers in more than one language is simply good service.",
          "When it fits your customers, we can plan for multilingual content, structured so each language version is clear for visitors and properly organized for search engines.",
        ],
      },
      {
        heading: "Restaurants, delivery, and neighborhood search",
        paragraphs: [
          "From Astoria to Flushing to Jackson Heights, Queens has an extraordinary restaurant scene, and much of it runs on delivery and takeout. A restaurant website here should make ordering, menus, and hours effortless, and help diners who search by dish, cuisine, or neighborhood find you.",
        ],
      },
    ],
    communities: ["Astoria", "Long Island City", "Flushing", "Jackson Heights", "Forest Hills", "Bayside", "Ridgewood", "Jamaica"],
    focusIndustries: ["/websites-for-restaurants", "/websites-for-salons", "/websites-for-auto-repair-shops", "/websites-for-contractors"],
    faqs: [
      remoteFaq,
      {
        q: "Can you build a website in more than one language?",
        a: "Yes, when it makes sense for your customers. We plan the structure so each language is easy to navigate and properly set up for search engines. You'll need translations you trust, which we can discuss.",
      },
      {
        q: "Most of our orders come through delivery apps. Do we need a website?",
        a: "A website gives you a reliable place for your menu, hours, and story that you control, and lets you feature direct ordering if you offer it.",
      },
      {
        q: "Do you work with businesses outside Queens and Long Island?",
        a: "Yes. Queens and Long Island are home base for the businesses we focus on, but we work with businesses elsewhere too.",
      },
    ],
  },
};
