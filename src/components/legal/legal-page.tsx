import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-3xl">
        <header className="border-b border-line pb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-3 text-sm text-muted">Last updated: {site.legalLastUpdated}</p>
        </header>
        <div className="legal-prose mt-10 space-y-8 text-[15px] leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </article>
  );
}

export function LegalContact() {
  return (
    <>
      <p>
        {site.legalName}
        <br />
        Email: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
      {site.mailingAddress && (
        <address className="mt-3 not-italic">
          {site.mailingAddress.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      )}
    </>
  );
}
