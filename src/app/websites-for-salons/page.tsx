import { IndustryPageTemplate, industryMetadata } from "@/components/templates/industry-page";
import { INDUSTRY_PAGES } from "@/content/industries";

const page = INDUSTRY_PAGES["salons"];

export const metadata = industryMetadata(page);

export default function Page() {
  return <IndustryPageTemplate page={page} />;
}
