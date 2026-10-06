import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export function About() {
  return (
    <section aria-labelledby="about-title" className="border-t border-line py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">About</p>
          <h2 id="about-title" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            About Fluxline
          </h2>
        </div>
        <div>
          <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              Fluxline was built around a simple observation: businesses spend enormous effort creating
              opportunities, but surprisingly little attention goes to what happens after an estimate
              doesn&apos;t immediately close.
            </p>
            <p className="font-medium text-ink">We focus on that gap.</p>
          </div>
          <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
            >
              CG
            </span>
            <div>
              <p className="font-semibold text-ink">{site.contact.name}</p>
              <p className="text-sm text-muted">
                {site.contact.title} | {site.legalName}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
