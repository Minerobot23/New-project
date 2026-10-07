import {
  BarChart3,
  Globe2,
  LayoutTemplate,
  MapPinned,
  MessageSquareText,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ServiceGroup = {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  items: { name: string; body: string }[];
};

/**
 * Capabilities, grouped the way owners think about them. Not every project includes every item;
 * scope is agreed per project.
 */
export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "design-build",
    icon: LayoutTemplate,
    title: "Website design & build",
    summary: "New websites and redesigns, designed around how your customers decide and what you want them to do next.",
    items: [
      { name: "Custom Business Websites", body: "Designed and built for your business, not adapted from a template marketplace." },
      { name: "Website Redesign", body: "Keep what works, fix what doesn't, and carry over the search value you've already built." },
      { name: "Mobile-First Design", body: "Designed for the phone first, then expanded for larger screens, not the other way around." },
      { name: "Conversion-Focused Design", body: "Clear calls-to-action, logical page flow, and fewer reasons for visitors to leave." },
    ],
  },
  {
    id: "industry",
    icon: Globe2,
    title: "Industry-specific websites",
    summary: "Websites shaped around how customers choose a contractor, a restaurant, a salon, or a repair shop.",
    items: [
      { name: "Restaurant Websites", body: "Readable HTML menus, hours, location, reservations, ordering, events, and catering." },
      { name: "Contractor Websites", body: "Service pages, project galleries, service areas, financing information, and estimate requests." },
      { name: "Menus", body: "Fast, mobile-friendly menus that are easy to update and visible to search engines." },
    ],
  },
  {
    id: "lead-tools",
    icon: MessageSquareText,
    title: "Quote, booking & ordering paths",
    summary: "The parts of a website that turn interest into a request, a booking, or an order.",
    items: [
      { name: "Quote Request Systems", body: "Short, well-designed forms that collect what you need and notify you right away." },
      { name: "Appointment Forms", body: "Request forms, or integration with the scheduling tool you already use." },
      { name: "Reservation Integrations", body: "Connect the reservation platform you already use so booking is one tap away." },
      { name: "Online Ordering Integration", body: "Link or embed your ordering provider in a way that feels like part of your site." },
    ],
  },
  {
    id: "search",
    icon: MapPinned,
    title: "Search structure & local SEO",
    summary: "Technical foundations and page structure that help search engines understand what you do and where.",
    items: [
      { name: "Service Pages", body: "Dedicated pages for the services customers actually search for." },
      { name: "Location Pages", body: "Genuinely useful pages for the areas you serve, not hundreds of copy-paste city pages." },
      { name: "Local SEO Structure", body: "Clear business information, structured data, and internal linking that support local search." },
      { name: "Technical SEO", body: "Clean URLs, metadata, sitemaps, canonical URLs, and indexable, fast pages." },
    ],
  },
  {
    id: "measurement",
    icon: BarChart3,
    title: "Analytics & performance",
    summary: "Know what's working, and keep the site fast enough that it doesn't get in the way.",
    items: [
      { name: "Analytics", body: "Privacy-conscious analytics that show where visitors come from and what they do." },
      { name: "Conversion Tracking", body: "Track calls, form submissions, and bookings so decisions are based on real behavior." },
      { name: "Performance Optimization", body: "Optimized images, fonts, and code for fast loading on real phones and networks." },
    ],
  },
  {
    id: "launch-care",
    icon: Wrench,
    title: "Launch & ongoing care",
    summary: "The technical work around a launch, and help afterward if you want it.",
    items: [
      { name: "Domain Configuration", body: "Domain, DNS, and HTTPS set up carefully, without breaking your existing email." },
      { name: "Deployment", body: "Reliable, modern hosting with secure defaults." },
      { name: "Maintenance", body: "Updates, content changes, and monitoring on an arrangement that fits your needs." },
    ],
  },
];
