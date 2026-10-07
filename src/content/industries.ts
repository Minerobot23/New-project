import type { IndustryId } from "@/components/simulator/types";
import type { Faq } from "@/components/ui/faq-list";

export type IndustryPage = {
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Simulator industries to embed; omit for none. */
  simulator?: IndustryId[];
  simulatorNote?: string;
  journey: { title: string; intro: string; steps: { label: string; body: string }[] };
  problems: { title: string; body: string }[];
  conversions: { title: string; items: string[] };
  features: { title: string; body: string }[];
  mobile: { title: string; points: string[] };
  seo: { title: string; points: string[] };
  approach: string[];
  extra?: { title: string; body: string[] };
  faqs: Faq[];
  articles: string[];
};

export const INDUSTRY_PAGES: Record<string, IndustryPage> = {
  contractors: {
    path: "/websites-for-contractors",
    name: "Contractors & Remodelers",
    metaTitle: "Websites for Contractors & Remodelers",
    metaDescription:
      "Contractor and remodeler websites built around how homeowners choose: project galleries, clear services, service areas, and estimate requests that bring in better-qualified leads.",
    h1: "Websites for contractors and remodelers that turn browsing into estimate requests.",
    intro:
      "Homeowners planning a kitchen, bath, addition, or renovation compare contractors carefully. Your website is often where that comparison is won or lost, usually before you ever hear from them.",
    simulator: ["home"],
    simulatorNote:
      "This demo is an HVAC company, but the same principles apply to remodelers: obvious next steps, organized services, visible proof, and a phone-first layout.",
    journey: {
      title: "How homeowners choose a contractor",
      intro: "Remodeling decisions are slow, visual, and high-stakes. Most homeowners shortlist two or three contractors before asking anyone for a price.",
      steps: [
        { label: "Inspiration", body: "They collect ideas and start forming a picture of the finished project." },
        { label: "Research", body: "They look for contractors who do that type of work, in their area, at their level of quality." },
        { label: "Proof", body: "They study past projects, reviews, and signs that you're licensed, insured, and established." },
        { label: "Shortlist", body: "They compare two or three contractors whose work and communication feel trustworthy." },
        { label: "Estimate request", body: "They reach out to the ones that made it easiest to understand what working together looks like." },
      ],
    },
    problems: [
      { title: "No recent project photos", body: "A gallery that stopped in a previous decade suggests the business did too." },
      { title: "Everything on one page", body: "Kitchens, baths, basements, and additions crammed into a single list don't match how homeowners search." },
      { title: "No sense of process", body: "Homeowners worry about timelines, mess, and surprises. Silence on those topics adds uncertainty." },
      { title: "A generic contact form", body: "\"Name, email, message\" produces vague inquiries that are hard to qualify." },
      { title: "Unclear service area", body: "Visitors can't tell whether you work in their town." },
      { title: "Credentials buried or missing", body: "Licensing and insurance are basic trust signals that are often hard to find." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Estimate or consultation requests that include project type, location, and timing",
        "Phone calls from homeowners ready to talk",
        "Gallery and project views that lead to an inquiry",
        "Return visits from homeowners still comparing",
      ],
    },
    features: [
      { title: "Project galleries by type", body: "Kitchens, baths, exteriors, and additions each get their own gallery, with before-and-after pairs where available." },
      { title: "Dedicated service pages", body: "Each major project type explains scope, process, and what homeowners can expect." },
      { title: "A qualifying estimate form", body: "A few smart questions (project type, town, rough timeline, optional budget range) help you prioritize serious inquiries." },
      { title: "Your process, explained", body: "From consultation to final walkthrough, a clear process reduces anxiety and sets expectations." },
      { title: "Service area clarity", body: "Towns and counties served, shown plainly, with location pages where they're genuinely useful." },
      { title: "Credentials and reviews", body: "License and insurance details and real customer reviews, presented where decisions are made." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "Galleries that swipe smoothly and load quickly on a phone",
        "A short estimate form that's easy to complete with a thumb",
        "Click-to-call in the header for homeowners ready to talk now",
        "Optimized images so large project photos don't slow everything down",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Separate pages for the services people search for, such as kitchen remodeling or basement finishing",
        "Project pages that mention the type of work and the town, with descriptive image alt text",
        "Business details consistent with your Google Business Profile",
        "Internal links connecting services, projects, and service areas",
      ],
    },
    approach: [
      "We start by understanding the projects you want more of, and the ones you'd rather avoid. That shapes which services get the most visibility and how the estimate form qualifies inquiries.",
      "Then we organize your best work into a portfolio homeowners can actually browse, and design every page so the next step, an estimate request or a call, is always one tap away.",
    ],
    faqs: [
      {
        q: "Should a contractor website show prices?",
        a: "Exact prices rarely make sense for custom work, but ranges or \"projects typically start at\" guidance can help filter out poor-fit inquiries. We'll help you decide what's comfortable to share.",
      },
      {
        q: "We don't have great project photos. Is that a problem?",
        a: "It's common. We can launch with the best photos you have and plan simple ways to capture better ones on future jobs. Even phone photos can work well when they're chosen and presented carefully.",
      },
      {
        q: "How do we get fewer tire-kickers?",
        a: "A well-designed estimate form with a few qualifying questions, plus clear information about your services, process, and service area, helps the right homeowners self-select.",
      },
      {
        q: "Do we need a separate page for every service?",
        a: "For your main project types, usually yes. Dedicated pages are easier for homeowners to scan and give search engines clearer signals about what you do.",
      },
    ],
    articles: ["what-makes-a-good-contractor-website", "website-gets-traffic-but-no-leads", "how-much-does-a-small-business-website-cost"],
  },

  hvac: {
    path: "/websites-for-hvac-companies",
    name: "HVAC Companies",
    metaTitle: "Websites for HVAC Companies",
    metaDescription:
      "HVAC websites built for urgent calls and planned replacements: click-to-call, emergency service, financing, maintenance plans, and service-area pages that make it easy to choose you.",
    h1: "HVAC websites built for the moment the AC quits.",
    intro:
      "HVAC customers arrive in two very different moods: urgent, because something stopped working, or deliberate, because they're planning a replacement. A good HVAC website serves both without making either one work for it.",
    simulator: ["home"],
    journey: {
      title: "Two customer journeys, one website",
      intro: "The same homeowner may be urgent in July and deliberate in October. Your website has to handle both.",
      steps: [
        { label: "Urgent: search", body: "No heat or no cooling. They search on a phone, often for \"near me\" results." },
        { label: "Urgent: decide", body: "They look for availability, emergency service, and a phone number, then call whoever makes it easiest." },
        { label: "Planned: research", body: "For a replacement, they compare companies, system types, and costs over days or weeks." },
        { label: "Planned: reassure", body: "Financing, warranties, reviews, and a clear estimate process reduce the risk of a big purchase." },
        { label: "Planned: request", body: "They request an in-home estimate from the companies that explained things best." },
      ],
    },
    problems: [
      { title: "Phone number hard to find on mobile", body: "In an emergency, every extra tap or scroll is a chance to call someone else." },
      { title: "No emergency messaging", body: "If visitors can't tell whether you offer after-hours service, many will assume you don't." },
      { title: "Repair and replacement mixed together", body: "Urgent repair visitors and planned replacement shoppers need different information." },
      { title: "Financing hidden or missing", body: "For a system replacement, monthly options can be what makes the decision possible." },
      { title: "No maintenance plan story", body: "Plans create recurring revenue, but many sites barely mention them." },
      { title: "Service area guesswork", body: "Homeowners shouldn't have to call just to find out if you cover their town." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Phone calls, especially emergency and same-day service calls",
        "Online service requests or bookings",
        "In-home estimate requests for replacements",
        "Maintenance plan sign-ups",
      ],
    },
    features: [
      { title: "Persistent click-to-call", body: "A call button in the header and a sticky mobile bar, so the phone is never more than a thumb away." },
      { title: "Emergency service banner", body: "Clear, honest information about after-hours availability, shown where urgent visitors look first." },
      { title: "Repair vs. replacement paths", body: "Separate pages for repairs, installs, heat pumps and ductless, indoor air quality, and maintenance." },
      { title: "Financing page", body: "Plain-language financing information and a link to pre-qualify, if you offer it." },
      { title: "Maintenance plans", body: "What's included, why it matters, and how to sign up." },
      { title: "Service area pages", body: "Useful, specific pages for your core towns, not hundreds of copies." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "Urgent visitors are almost always on a phone, often in an uncomfortable house",
        "Large tap targets for call and request buttons",
        "Fast pages, even on a weak signal",
        "Short service request forms that work with autofill",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Service pages that match how people search, such as AC repair, furnace replacement, or heat pump installation",
        "Location pages with genuinely local information for your core service areas",
        "Seasonal content that answers real questions, like maintenance checklists",
        "Consistent business details across your website and Google Business Profile",
      ],
    },
    approach: [
      "We design HVAC websites around the urgent visitor first, because that's where speed and clarity matter most. Then we build the deeper replacement content that helps planned buyers choose you with confidence.",
      "We also make sure calls and form submissions can be tracked, so you can see whether the website is actually bringing in work.",
    ],
    faqs: [
      {
        q: "Should we offer online booking or just phone calls?",
        a: "Many homeowners prefer to call during an emergency, while others prefer booking a maintenance visit online. Offering both, with calls prioritized for urgent needs, usually serves customers best.",
      },
      {
        q: "Should we publish system replacement prices?",
        a: "Exact prices depend on the home, but explaining what affects cost and offering financing information helps homeowners feel informed before your visit.",
      },
      {
        q: "Do we need a page for every town we serve?",
        a: "No. A handful of genuinely useful pages for your core areas is better than dozens of near-duplicate pages, which can do more harm than good.",
      },
      {
        q: "How should the website handle after-hours calls?",
        a: "Be clear about what happens after hours, whether that's 24/7 emergency service, an answering service, or next-morning callbacks. Honest expectations prevent frustrated customers.",
      },
    ],
    articles: ["how-to-turn-website-visitors-into-calls", "website-gets-traffic-but-no-leads", "how-long-does-it-take-to-build-a-website"],
  },

  plumbers: {
    path: "/websites-for-plumbers",
    name: "Plumbers",
    metaTitle: "Websites for Plumbers",
    metaDescription:
      "Plumbing websites built for emergencies and planned work: fast click-to-call, clear service pages, honest pricing explanations, and trust signals for customers letting you into their home.",
    h1: "Plumbing websites that earn the call, and the trust to let you in.",
    intro:
      "A burst pipe and a water heater replacement are very different visits, but both depend on the same thing: a homeowner deciding quickly that you're reliable and trustworthy enough to let into their home.",
    simulator: ["home"],
    simulatorNote:
      "This demo shows a home-service company. Plumbing sites follow the same pattern: call first, services organized by need, and trust built early.",
    journey: {
      title: "How customers choose a plumber",
      intro: "Most plumbing searches start with a problem, not a plan.",
      steps: [
        { label: "Something goes wrong", body: "A leak, a clog, no hot water. Often stressful, sometimes urgent." },
        { label: "Search and triage", body: "They search on a phone and quickly look for availability, location, and a way to reach you." },
        { label: "Trust check", body: "Reviews, licensing, how you explain pricing, and whether the site feels professional." },
        { label: "Contact", body: "A call for urgent problems, a request form for planned work like water heaters or fixtures." },
      ],
    },
    problems: [
      { title: "No guidance for emergencies", body: "Visitors with water on the floor need a phone number and maybe one useful tip, not paragraphs." },
      { title: "Services listed, not explained", body: "Customers want to know if you handle their specific problem." },
      { title: "Pricing approach unclear", body: "Fear of surprise bills is real. Explaining how pricing works builds trust." },
      { title: "Residential and commercial blurred together", body: "Property managers and homeowners look for different things." },
      { title: "Faceless business", body: "People are inviting someone into their home. A little about who shows up goes a long way." },
      { title: "Slow, cluttered mobile pages", body: "Stressed visitors on phones don't wait." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Emergency and same-day phone calls",
        "Service requests for non-urgent work",
        "Estimate requests for water heaters, repiping, and remodels",
        "Commercial and property-management inquiries",
      ],
    },
    features: [
      { title: "Emergency-first header", body: "Call button and availability information at the top of every page on mobile." },
      { title: "\"What to do right now\" guidance", body: "Short, practical pages like how to shut off your main water valve. Genuinely helpful, and good for search." },
      { title: "Problem-based service pages", body: "Drain cleaning, leak repair, water heaters, sump pumps, and fixtures, organized by what customers are dealing with." },
      { title: "Pricing explained", body: "How estimates, service fees, and approvals work, in plain language." },
      { title: "Meet the team", body: "Real names and faces, if you're comfortable sharing them, to help homeowners feel at ease." },
      { title: "Request form with photo upload", body: "Letting customers attach a photo of the problem can save a trip and speed up quotes." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "Sticky call button on every page",
        "Minimal pop-ups and interruptions",
        "Forms that work well one-handed",
        "Fast loading, even on a weak connection in a basement",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Dedicated pages for high-intent services like water heater replacement and drain cleaning",
        "Helpful how-to content that answers real homeowner questions",
        "Clear service-area information with location pages only where they add value",
        "Business details consistent with your Google Business Profile",
      ],
    },
    approach: [
      "We design plumbing websites to calm a stressed visitor down and make calling you the obvious next step. That means fast pages, a visible phone number, and honest explanations.",
      "For planned work, we build clear service pages and request forms that collect the details you need to quote accurately.",
    ],
    faqs: [
      {
        q: "Is helpful how-to content worth it for a plumbing company?",
        a: "Yes, when it's genuinely useful. A short guide on shutting off your water can help a homeowner in the moment, and it builds trust and gives search engines a reason to show your site.",
      },
      {
        q: "Should we show our prices?",
        a: "Many plumbers don't publish exact prices, but explaining how pricing works, such as service fees, estimates, and approvals before work begins, reduces the fear of surprise bills.",
      },
      {
        q: "Should commercial work have its own section?",
        a: "If commercial work is meaningful to you, yes. Property managers and businesses look for different information than homeowners do.",
      },
      {
        q: "Can customers send photos of the problem?",
        a: "We can include a photo upload in your request form. Many customers find it easier, and it can help you prepare for the visit.",
      },
    ],
    articles: ["how-to-turn-website-visitors-into-calls", "what-makes-a-good-contractor-website", "does-my-business-need-a-website"],
  },

  roofers: {
    path: "/websites-for-roofers",
    name: "Roofers",
    metaTitle: "Websites for Roofing Companies",
    metaDescription:
      "Roofing websites that build trust for high-ticket decisions: inspection requests, storm damage guidance, materials and warranty information, project galleries, and financing.",
    h1: "Roofing websites built for big decisions and skeptical homeowners.",
    intro:
      "A new roof is one of the largest purchases a homeowner makes, and after a storm they're often wary of companies they don't know. Your website has to establish credibility quickly and explain the process clearly.",
    simulator: ["home"],
    simulatorNote:
      "This home-service demo shows the patterns roofing sites need too: an obvious inspection or estimate request, trust signals, financing, and service areas.",
    journey: {
      title: "How homeowners choose a roofer",
      intro: "Roofing decisions are usually triggered by a leak, storm damage, or an aging roof, and they're rarely rushed into once the immediate problem is handled.",
      steps: [
        { label: "Trigger", body: "A leak, missing shingles after a storm, or an inspection that flagged an aging roof." },
        { label: "Legitimacy check", body: "Is this an established, local company or a storm chaser? Address, licensing, history, reviews." },
        { label: "Education", body: "Repair or replace? Which materials? Will insurance cover it? How long will it take?" },
        { label: "Inspection request", body: "They request inspections from a short list of companies that explained things clearly." },
        { label: "Decision", body: "Warranty, financing, communication, and confidence decide the final choice." },
      ],
    },
    problems: [
      { title: "No proof of local legitimacy", body: "Without clear business details, it's hard to stand apart from out-of-town storm crews." },
      { title: "No storm or insurance guidance", body: "Homeowners have questions about claims. Silence sends them elsewhere." },
      { title: "Materials and warranties unexplained", body: "Large purchases need clear explanations of what's being installed and what's covered." },
      { title: "Weak project photos", body: "Roofing is visual. Before-and-after and finished-project photos matter." },
      { title: "No inspection CTA", body: "\"Contact us\" isn't as compelling as a clear, specific next step." },
      { title: "Financing not mentioned", body: "Monthly options can make an unexpected replacement manageable." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Roof inspection and estimate requests",
        "Phone calls about active leaks and storm damage",
        "Insurance claim assistance inquiries",
        "Financing applications or questions",
      ],
    },
    features: [
      { title: "Inspection request flow", body: "A clear request with address, issue type, and optional photo upload." },
      { title: "Storm damage page", body: "What to do after a storm, what to look for, and how you can help, written honestly." },
      { title: "Insurance process explained", body: "How the claim process typically works and where you fit in, without promising outcomes." },
      { title: "Materials pages", body: "Asphalt, metal, slate, flat roofing, and more: what each costs relative to the others, how long it lasts, and who it suits." },
      { title: "Warranty clarity", body: "Workmanship and manufacturer warranty details in plain language." },
      { title: "Project gallery", body: "Before-and-after and finished projects, organized by material and town." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "After a storm, homeowners are often outside, on a phone, looking at damage",
        "Photo upload directly from the phone camera",
        "Click-to-call for active leaks",
        "Fast-loading galleries with optimized images",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Pages for roof replacement, roof repair, storm damage, and each roofing material you install",
        "Project pages that describe the work and location",
        "Location pages for core service areas with real local information",
        "Consistent business information that reinforces legitimacy",
      ],
    },
    approach: [
      "We focus roofing websites on credibility first: who you are, where you're based, how long you'll be around to honor a warranty, and how you handle the process from inspection to cleanup.",
      "Then we make the next step obvious, whether that's a free inspection request, a call about a leak, or a financing question.",
    ],
    faqs: [
      {
        q: "How do we stand out from storm-chasing companies?",
        a: "Clear local business information, licensing and insurance details, warranty explanations, real project history, and honest storm guidance all help homeowners recognize an established company.",
      },
      {
        q: "Should we talk about insurance claims on our website?",
        a: "Yes, carefully. Explaining how the process generally works and how you help is useful. Avoid promising coverage or outcomes, which you can't control.",
      },
      {
        q: "Are material pages worth it?",
        a: "Homeowners research materials before deciding, and those pages answer real questions. They also help search engines understand the work you do.",
      },
      {
        q: "Can homeowners send photos of damage?",
        a: "Yes. A photo upload in your inspection request makes it easier for homeowners and gives you context before the visit.",
      },
    ],
    articles: ["what-makes-a-good-contractor-website", "website-redesign-checklist", "how-much-does-a-small-business-website-cost"],
  },

  restaurants: {
    path: "/websites-for-restaurants",
    name: "Restaurants",
    metaTitle: "Websites for Restaurants",
    metaDescription:
      "Restaurant websites with readable HTML menus, accurate hours, reservations, online ordering, private events, and directions, designed for diners deciding on their phones.",
    h1: "Restaurant websites that fill tables, not just inboxes.",
    intro:
      "Diners decide fast. They want the menu, the hours, the location, and a way to reserve or order, usually on a phone and often minutes before they leave. Every extra tap is a reason to choose somewhere else.",
    simulator: ["restaurant"],
    journey: {
      title: "How diners choose where to eat",
      intro: "Restaurant decisions are quick, visual, and often made in a group chat.",
      steps: [
        { label: "Discover", body: "From search, maps, social media, or a friend's recommendation." },
        { label: "Check the menu", body: "Dishes, prices, and dietary options, usually the first thing people look for." },
        { label: "Check the vibe", body: "Photos of food and space help them picture the occasion." },
        { label: "Check the practical", body: "Hours today, location, parking, and whether they need a reservation." },
        { label: "Act", body: "Reserve, order, call, or get directions, ideally in one tap." },
      ],
    },
    problems: [
      { title: "PDF menus", body: "Slow to download, hard to read on a phone, often outdated, and invisible to search engines." },
      { title: "Hours that don't match reality", body: "Outdated or conflicting hours across your site and listings frustrate guests." },
      { title: "Buried reservation links", body: "A small text link is easy to miss when it's the most important action." },
      { title: "Social icons louder than reservations", body: "Big social buttons send visitors away before they book." },
      { title: "Address hidden in the footer", body: "Location and directions should be easy to find." },
      { title: "Heavy, slow pages", body: "Oversized images make phones wait, and hungry people don't." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Reservations",
        "Online orders for pickup or delivery",
        "Calls and directions requests",
        "Private dining, catering, and event inquiries",
        "Gift card purchases",
      ],
    },
    features: [
      { title: "A real HTML menu", body: "Fast, readable, easy to update, and visible to search engines. Organized by course with dietary notes." },
      { title: "Hours, location, and directions", body: "Today's hours and one-tap directions near the top of the page, with holiday hours when they change." },
      { title: "Reservation integration", body: "Your existing reservation platform, connected so booking feels like part of your site." },
      { title: "Online ordering", body: "A prominent ordering path. If you offer direct ordering, we can feature it ahead of third-party delivery apps." },
      { title: "Private dining & catering", body: "Dedicated pages and inquiry forms for higher-value bookings." },
      { title: "Photography, handled well", body: "Appetizing images, optimized so they look great without slowing the page." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "Reserve, Menu, and Order as the first actions on a phone",
        "A sticky bar for reserving or ordering while browsing the menu",
        "Menus that are easy to read without zooming",
        "Fast loading on cellular connections",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "HTML menus let search engines see your dishes, which can help people searching for specific food find you",
        "Restaurant structured data for hours, cuisine, and location",
        "Accurate hours and details that match your Google Business Profile",
        "Pages for private events and catering, which people search for separately",
      ],
    },
    approach: [
      "We design restaurant websites around the three things diners actually want: what's on the menu, whether you're open, and how to get a table or an order.",
      "We also make updates practical. If your menu changes often, we'll plan an easy way to keep it current so your site never contradicts what's on the table.",
    ],
    faqs: [
      {
        q: "Is a PDF menu really that bad?",
        a: "For phones, usually yes. PDFs are slow to load, hard to read without zooming, and search engines can't use them as well as a regular web page. An HTML menu solves all three.",
      },
      {
        q: "We're active on Instagram. Do we still need a website?",
        a: "Instagram is great for discovery and atmosphere, but diners still look for menus, hours, and reservations in a reliable place. A website gives you that, plus a presence in search results that you control.",
      },
      {
        q: "Should we link to delivery apps?",
        a: "You can. If you also offer direct online ordering, we can feature it first so more orders come through the channel you prefer.",
      },
      {
        q: "How do we keep the menu and hours up to date?",
        a: "We'll set things up so updates are simple, or handle them for you. Accurate hours across your site and listings are one of the easiest ways to avoid disappointed guests.",
      },
    ],
    articles: ["what-should-a-restaurant-website-include", "website-vs-social-media", "how-long-does-it-take-to-build-a-website"],
  },

  salons: {
    path: "/websites-for-salons",
    name: "Salons, Spas & Wellness",
    metaTitle: "Websites for Salons, Spas & Med Spas",
    metaDescription:
      "Websites for salons, barbershops, spas, and med spas with clear services and starting prices, team profiles, galleries, and booking that's always one tap away.",
    h1: "Salon and wellness websites that make booking feel effortless.",
    intro:
      "Clients choose a salon, barbershop, spa, or med spa based on trust in the people and the results. They want to see the work, understand the services and prices, and book without a phone call. Your website should do all three beautifully.",
    simulator: ["salon"],
    journey: {
      title: "How new clients choose",
      intro: "Beauty and wellness decisions are personal. New clients are looking for reassurance as much as information.",
      steps: [
        { label: "Discover", body: "Through search, Instagram, maps, or a friend's recommendation." },
        { label: "See the work", body: "Galleries and real results, matched to the look or treatment they want." },
        { label: "Understand services and prices", body: "What each service includes, how long it takes, and roughly what it costs." },
        { label: "Choose a person", body: "Many clients book a specific stylist, barber, or provider based on specialty." },
        { label: "Book", body: "Online, at a time that suits them, often late in the evening." },
      ],
    },
    problems: [
      { title: "\"Call for pricing\"", body: "Many new clients won't call just to find out if a service fits their budget." },
      { title: "Booking buried or off-brand", body: "A small link to an unbranded booking page feels disconnected." },
      { title: "Services as a long, unclear list", body: "Without grouping, durations, or descriptions, it's hard to know what to book." },
      { title: "No team profiles", body: "Clients want to know who they'll see and what each person specializes in." },
      { title: "Generic template photos", body: "Stock images say nothing about your work or your space." },
      { title: "Cramped mobile layout", body: "A premium service deserves a premium mobile experience." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Online bookings",
        "New-client consultations",
        "Gift card purchases",
        "Membership or package sign-ups",
        "Calls and directions",
      ],
    },
    features: [
      { title: "Services with starting prices", body: "Grouped by category, with what's included, duration, and \"starting at\" pricing." },
      { title: "Booking integration", body: "Connect the scheduling software you already use, with Book buttons throughout the site." },
      { title: "Team profiles", body: "Specialties, experience, and a direct booking link for each team member." },
      { title: "Gallery", body: "Your real work, organized so clients can find the looks or treatments they care about." },
      { title: "New-client information", body: "What to expect at a first visit, consultation details, and policies like cancellations." },
      { title: "Gift cards and memberships", body: "Easy ways to buy for someone else or commit to regular visits." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "A Book button that's always visible on mobile",
        "Readable service menus without zooming",
        "Galleries that feel smooth and look sharp on phone screens",
        "Booking that works well late at night, when many clients plan",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Service pages for the treatments people search for, like balayage, keratin treatments, or facials",
        "Location information that matches your Google Business Profile",
        "Descriptive image alt text for gallery images",
        "For med spas: careful, accurate treatment descriptions without unsupported claims",
      ],
    },
    approach: [
      "We design salon and wellness websites to feel like your space: calm, polished, and personal. Then we make booking the easiest thing on every page.",
      "For med spas and wellness providers, we write treatment pages carefully and avoid overstated claims, which protects both your clients and your reputation.",
    ],
    extra: {
      title: "Barbershops and med spas",
      body: [
        "Barbershops benefit from the same essentials, plus clear walk-in versus appointment information and barber-specific booking.",
        "Med spas need consultation-focused flows, clear treatment pages, provider credentials presented accurately, and particular care with any claims about results.",
      ],
    },
    faqs: [
      {
        q: "Should we list prices on our website?",
        a: "\"Starting at\" prices are usually the right balance. They help new clients self-select without committing you to a price before a consultation.",
      },
      {
        q: "Can you work with our current booking software?",
        a: "In most cases, yes. We connect your existing scheduling platform so clients can book from anywhere on your site.",
      },
      {
        q: "We get most clients from Instagram. Why invest in a website?",
        a: "Instagram shows your work. A website answers the practical questions about services, prices, location, and policies, and gives clients a polished, reliable place to book. The two work best together.",
      },
      {
        q: "How do we handle before-and-after photos?",
        a: "With client permission, and presented honestly. For med spas especially, results should be shown accurately and without exaggeration.",
      },
    ],
    articles: ["website-vs-social-media", "how-to-turn-website-visitors-into-calls", "how-often-should-a-website-be-redesigned"],
  },

  "auto-repair": {
    path: "/websites-for-auto-repair-shops",
    name: "Auto Repair & Detailing",
    metaTitle: "Websites for Auto Repair Shops & Detailers",
    metaDescription:
      "Auto repair and detailing websites that build trust before the first visit: service scheduling by vehicle, clear services, warranty information, hours, directions, and reviews.",
    h1: "Auto repair websites that earn trust before the first oil change.",
    intro:
      "Most drivers already worry about being upsold. A clear, professional website that explains your services, warranty, and process, and makes it easy to schedule, can be what tips a first-time customer toward your shop.",
    simulator: ["auto"],
    journey: {
      title: "How drivers choose a shop",
      intro: "Auto repair often starts with uncertainty: a warning light, a noise, or a car that won't start.",
      steps: [
        { label: "Something's wrong", body: "A check-engine light, brakes making noise, or an overdue service." },
        { label: "Search nearby", body: "Usually on a phone, looking for a shop close to home or work." },
        { label: "Trust check", body: "Reviews, warranty, whether you work on their make, and how you communicate." },
        { label: "Practical check", body: "Hours, location, wait times, loaners or shuttle service." },
        { label: "Act", body: "Call, schedule service, or get directions." },
      ],
    },
    problems: [
      { title: "Phone is the only option", body: "Many customers would rather request service online, especially outside business hours." },
      { title: "Services as a long list", body: "Drivers want to know you handle their specific problem and what the process looks like." },
      { title: "No warranty information", body: "A clear parts and labor warranty is a powerful trust signal that's often hidden." },
      { title: "Hours and location hard to find", body: "Practical details should be visible at a glance." },
      { title: "Makes and specialties unclear", body: "European, domestic, Asian, diesel, fleet: drivers want to know you've seen their car before." },
      { title: "No sense of how you communicate", body: "Approvals, photos of worn parts, and clear estimates reduce the fear of upselling." },
    ],
    conversions: {
      title: "The actions that matter",
      items: [
        "Service appointment requests",
        "Phone calls",
        "Directions to the shop",
        "Quote requests for specific repairs",
        "Fleet and commercial account inquiries",
      ],
    },
    features: [
      { title: "Schedule service by vehicle", body: "Year, make, model, and service type in a short request, so you're prepared before the car arrives." },
      { title: "Clear service pages", body: "Diagnostics, brakes, maintenance, A/C, suspension, inspections, explained without jargon." },
      { title: "Warranty and policies", body: "Parts and labor warranty, estimate approvals, and how you communicate during repairs." },
      { title: "Hours, location, amenities", body: "Hours, directions, parking, waiting area, loaners, or shuttle, wherever applicable." },
      { title: "Makes and specialties", body: "The vehicles you work on most and any specialties you're known for." },
      { title: "Reviews and credentials", body: "Real reviews and any certifications your technicians actually hold." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "Call, Schedule, and Directions as a sticky bar on phones",
        "A short service request that's easy to complete in a parking lot",
        "Hours visible without scrolling",
        "Fast loading on cellular connections",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Service pages that match searches like brake repair or check engine light diagnostics",
        "Make-specific pages if you specialize",
        "Consistent business information with your Google Business Profile",
        "Location information that helps nearby drivers find you",
      ],
    },
    approach: [
      "We design auto repair websites to answer the questions drivers are nervous about before they ask: what will this cost, will you explain it, and will you stand behind the work?",
      "Then we make scheduling as easy as calling, so you capture customers who'd rather book online at 10 p.m.",
    ],
    extra: {
      title: "Auto detailing businesses",
      body: [
        "Detailing customers shop differently: they compare packages, prices, and results. Detailing websites benefit from clear package tiers, before-and-after galleries, add-on options, and online booking, plus clear information on whether you're mobile or shop-based and which areas you cover.",
      ],
    },
    faqs: [
      {
        q: "Should we offer online scheduling if we prefer phone calls?",
        a: "Offering a service request form alongside your phone number captures customers who'd rather not call, especially after hours, while still letting you confirm details personally.",
      },
      {
        q: "Should we publish prices?",
        a: "For standard services like oil changes or detailing packages, published prices or starting prices often help. For diagnostic and repair work, explaining your estimate and approval process is usually better.",
      },
      {
        q: "How do we show we're trustworthy?",
        a: "Real reviews, a clear warranty, explaining how you communicate and get approvals before work, and accurate information about any credentials your team holds.",
      },
      {
        q: "We also do fleet work. Should that be on the site?",
        a: "Yes. A dedicated fleet or commercial page speaks to a different decision-maker and can bring in steady, valuable work.",
      },
    ],
    articles: ["how-to-turn-website-visitors-into-calls", "website-gets-traffic-but-no-leads", "how-much-does-a-small-business-website-cost"],
  },

  "local-businesses": {
    path: "/websites-for-local-businesses",
    name: "Local Businesses",
    metaTitle: "Websites for Local Businesses",
    metaDescription:
      "Websites for local businesses: cafes, bakeries, bars, gyms, retail shops, landscapers, electricians, restoration companies, and professional services, built around the next step customers take.",
    h1: "Websites for local businesses that customers can actually use.",
    intro:
      "Whether you run a café, a gym, a boutique, a landscaping company, or a professional practice, customers come to your website with a few practical questions and one next step in mind. We design around both.",
    simulator: ["home", "restaurant", "salon", "auto"],
    journey: {
      title: "What every local customer wants to know",
      intro: "The details change by business, but the pattern is remarkably consistent.",
      steps: [
        { label: "Is this what I need?", body: "What you offer, explained clearly and specifically." },
        { label: "Is it right for me?", body: "Prices or price ranges, style, quality, and who you serve." },
        { label: "Can I trust them?", body: "Reviews, real photos, credentials, and a professional presentation." },
        { label: "Is it convenient?", body: "Location, hours, service area, availability." },
        { label: "What do I do next?", body: "Call, book, order, visit, or request a quote." },
      ],
    },
    problems: [
      { title: "A DIY site that never got finished", body: "Placeholder text and missing pages undermine an otherwise great business." },
      { title: "Information that's out of date", body: "Old hours, old prices, or old photos create bad first impressions." },
      { title: "No clear next step", body: "Visitors should never have to guess how to buy, book, or get in touch." },
      { title: "Poor mobile experience", body: "Local searches often happen on the go." },
      { title: "Relying only on social media", body: "Social profiles are great for updates but weak for the practical details customers need." },
      { title: "Invisible in search", body: "Without basic structure, search engines struggle to understand what you do and where." },
    ],
    conversions: {
      title: "Next steps, by type of business",
      items: [
        "Cafés, bakeries, and bars: visits, orders, catering, and events",
        "Gyms and fitness studios: trial classes, memberships, and schedules",
        "Retail: store visits, product inquiries, and online orders",
        "Landscapers, electricians, and restoration companies: calls and estimate requests",
        "Professional services: consultation requests",
      ],
    },
    features: [
      { title: "Clear offer pages", body: "What you offer, organized the way customers think about it." },
      { title: "Hours, location, and directions", body: "Always accurate and always easy to find." },
      { title: "The right conversion tool", body: "Booking, ordering, class schedules, quote forms, or click-to-call, matched to your business." },
      { title: "Real photography", body: "Your space, your team, and your work, presented well." },
      { title: "Reviews and credibility", body: "Real customer feedback and relevant credentials, presented honestly." },
      { title: "Easy updates", body: "A plan for keeping hours, menus, schedules, and offers current." },
    ],
    mobile: {
      title: "Mobile considerations",
      points: [
        "One-tap calls, directions, and bookings",
        "Hours and location visible immediately",
        "Fast pages for customers on the go",
        "Readable text and generous tap targets",
      ],
    },
    seo: {
      title: "Search considerations",
      points: [
        "Pages that match what customers search for, by product, service, or category",
        "Consistent name, address, and phone information across your website and listings",
        "Structured data that helps search engines understand your business type",
        "Fast, mobile-friendly pages that meet modern search standards",
      ],
    },
    approach: [
      "Every business is different, so we start with a conversation about how your customers decide and what you want them to do. The website's structure follows from that.",
      "Explore the concept demos above to see how the same principles apply across very different kinds of businesses.",
    ],
    extra: {
      title: "Restoration, landscaping, and other trades",
      body: [
        "Restoration companies need emergency-first design similar to plumbing and HVAC, plus clear explanations of insurance processes. Landscapers and electricians benefit from project galleries, seasonal service pages, and estimate forms that capture property details.",
      ],
    },
    faqs: [
      {
        q: "We're a small business. Is a professional website overkill?",
        a: "Not if it's scoped well. A focused site with a few strong pages often outperforms a large, unfocused one, and it can be built and maintained at a sensible cost.",
      },
      {
        q: "Can our website take orders or bookings?",
        a: "Yes. Depending on your business, that might mean integrating the booking, ordering, or class-scheduling software you already use, or setting up something new.",
      },
      {
        q: "We already have a DIY site. Should we start over?",
        a: "Not necessarily. We'll look at what's working first. Sometimes a redesign on a better foundation is the right move; sometimes targeted improvements are enough.",
      },
      {
        q: "How do we keep the website current?",
        a: "We plan for the updates you'll make most often, like hours, menus, schedules, and offers, so they're easy to change or handled for you.",
      },
    ],
    articles: ["does-my-business-need-a-website", "website-vs-social-media", "how-much-does-a-small-business-website-cost"],
  },
};
