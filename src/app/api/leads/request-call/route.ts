import type { NextRequest } from "next/server";
import { handleLead, tooManyLinks } from "@/lib/leads/handle-lead";
import { buildLeadEmail, looksLikeTest, mailtoHref, telHref } from "@/lib/leads/notification";
import {
  BUSINESS_TYPE_LABELS,
  PREFERRED_TIME_LABELS,
  PROJECT_TYPE_LABELS,
  requestCallSchema,
} from "@/lib/leads/schemas";

export async function POST(request: NextRequest) {
  return handleLead(request, {
    name: "request-call",
    schema: requestCallSchema,
    isSpam: (lead) => tooManyLinks(lead.message),
    buildEmail: (lead, recipients) => {
      const name = lead.name;
      return buildLeadEmail({
        heading: "NEW FLUXLINE WEBSITE LEAD",
        subject: `NEW FLUXLINE WEBSITE LEAD — ${lead.businessName}`,
        primaryName: name,
        businessName: lead.businessName,
        phone: lead.phone,
        replyTo: lead.email,
        recipients,
        attribution: lead.attribution,
        isTest: looksLikeTest(lead.name, lead.businessName),
        rows: [
          { label: "Name", value: name },
          { label: "Business", value: lead.businessName },
          { label: "Business Type", value: lead.businessType ? BUSINESS_TYPE_LABELS[lead.businessType] : "Not specified" },
          { label: "Looking For", value: lead.projectType ? PROJECT_TYPE_LABELS[lead.projectType] : "Not specified" },
          { label: "Website", value: lead.website ?? "None provided", href: lead.website },
          lead.email
            ? { label: "Email", value: lead.email, href: mailtoHref(lead.email) }
            : { label: "Email", value: "None provided" },
          { label: "Phone", value: lead.phone, href: telHref(lead.phone) },
          {
            label: "Preferred Time",
            value: lead.preferredTime ? PREFERRED_TIME_LABELS[lead.preferredTime] : "No preference",
          },
          { label: "Message", value: lead.message || "—" },
        ],
      });
    },
  });
}
