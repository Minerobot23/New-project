"use client";

import { Container } from "@/components/ui/container";
import { ButtonLink, buttonClasses } from "@/components/ui/button-link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Something went wrong.</h1>
        <p className="mt-4 text-ink-soft">Please try again. If the problem continues, return to the homepage.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonClasses("primary", "lg")}>
            Try again
          </button>
          <ButtonLink href="/" variant="secondary" size="lg">
            Go to homepage
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
