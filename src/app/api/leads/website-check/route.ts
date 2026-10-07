import type { NextRequest } from "next/server";
import { handleLead } from "@/lib/leads/handle-lead";
import { buildLeadEmail, looksLikeTest, mailtoHref, telHref } from "@/lib/leads/notification";
import { BUSINESS_TYPE_LABELS, websiteCheckSchema } from "@/lib/leads/schemas";

export async function POST(request: NextRequest) {
  return handleLead(request, {
    name: "website-check",
    schema: websiteCheckSchema,
    buildEmail: (lead, recipients) =>
      buildLeadEmail({
        heading: "NEW FLUXLINE WEBSITE CHECK",
        subject: `NEW FLUXLINE WEBSITE CHECK — ${lead.businessName}`,
        primaryName: lead.firstName,
        businessName: lead.businessName,
        phone: lead.phone,
        replyTo: lead.email,
        recipients,
        attribution: lead.attribution,
        isTest: looksLikeTest(lead.firstName, lead.businessName),
        rows: [
          { label: "Website to Review", value: lead.website, href: lead.website },
          { label: "Business", value: lead.businessName },
          { label: "Business Type", value: BUSINESS_TYPE_LABELS[lead.businessType] },
          { label: "First Name", value: lead.firstName },
          { label: "Email", value: lead.email, href: mailtoHref(lead.email) },
          {
            label: "Phone",
            value: lead.phone ?? "Not provided",
            href: lead.phone ? telHref(lead.phone) : undefined,
          },
        ],
      }),
  });
}
