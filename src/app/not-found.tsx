import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ORDER_CTA_LABEL, ORDER_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <p className="label text-muted">404</p>
        <h1 className="display mt-4 text-3xl uppercase text-ink sm:text-5xl">This page doesn&apos;t exist.</h1>
        <p className="mt-4 text-ink-soft">The link may be outdated, or the address may have a typo.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="secondary" size="lg">
            Go to homepage
          </ButtonLink>
          <ButtonLink href={ORDER_PATH} size="lg">
            {ORDER_CTA_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
