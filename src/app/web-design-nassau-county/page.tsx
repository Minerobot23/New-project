import { LocationPageTemplate, locationMetadata } from "@/components/templates/location-page";
import { LOCATION_PAGES } from "@/content/locations";

const page = LOCATION_PAGES["nassau-county"];

export const metadata = locationMetadata(page);

export default function Page() {
  return <LocationPageTemplate page={page} />;
}
