import type { ComponentType } from "react";
import CostArticle from "./articles/how-much-does-a-small-business-website-cost";
import NeedArticle from "./articles/does-my-business-need-a-website";
import RedesignFrequencyArticle from "./articles/how-often-should-a-website-be-redesigned";
import RedesignChecklistArticle from "./articles/website-redesign-checklist";
import ContractorArticle from "./articles/what-makes-a-good-contractor-website";
import RestaurantArticle from "./articles/what-should-a-restaurant-website-include";
import CallsArticle from "./articles/how-to-turn-website-visitors-into-calls";
import NoLeadsArticle from "./articles/website-gets-traffic-but-no-leads";
import SocialArticle from "./articles/website-vs-social-media";
import TimelineArticle from "./articles/how-long-does-it-take-to-build-a-website";

export const ARTICLE_BODIES: Record<string, ComponentType> = {
  "how-much-does-a-small-business-website-cost": CostArticle,
  "does-my-business-need-a-website": NeedArticle,
  "how-often-should-a-website-be-redesigned": RedesignFrequencyArticle,
  "website-redesign-checklist": RedesignChecklistArticle,
  "what-makes-a-good-contractor-website": ContractorArticle,
  "what-should-a-restaurant-website-include": RestaurantArticle,
  "how-to-turn-website-visitors-into-calls": CallsArticle,
  "website-gets-traffic-but-no-leads": NoLeadsArticle,
  "website-vs-social-media": SocialArticle,
  "how-long-does-it-take-to-build-a-website": TimelineArticle,
};
