import Link from "next/link";
import { redirect } from "next/navigation";
import { Notice, Panel, Shell } from "@/components/billing/ui";
import { ONBOARDING_SECTIONS } from "@/content/onboarding";
import { projectsForUser } from "@/lib/auth/core";
import { requireClient } from "@/lib/auth/session";
import { PLANS } from "@/lib/billing/plans";
import { getDb } from "@/lib/db";
import { getOnboarding } from "@/lib/portal/onboarding";
import { ACCEPTED_UPLOADS, MAX_UPLOADS_PER_PROJECT, listUploads } from "@/lib/portal/uploads";
import { OnboardingForm } from "./onboarding-form";
import { Uploader } from "./uploader";

export default async function OnboardingPage({ searchParams }: PageProps<"/client/onboarding">) {
  const { project: requested } = await searchParams;
  const user = await requireClient(`/client/onboarding${typeof requested === "string" ? `?project=${requested}` : ""}`);
  const db = await getDb();
  const owned = await projectsForUser(db, user.id);
  if (owned.length === 0) redirect("/client/dashboard");

  // Only the user's own projects can be opened; anything else falls back to their latest project.
  const match = owned.find((row) => row.project.id === requested) ?? owned[owned.length - 1];
  const { project, customer } = match;
  const saved = await getOnboarding(db, project.id);
  const files = await listUploads(db, project.id);
  const defaults = saved?.data ?? {
    businessName: customer.businessName,
    contactName: customer.contactName,
    contactEmail: user.email,
    contactPhone: customer.phone ?? "",
  };

  return (
    <Shell className="py-10 sm:py-14">
      <Link href="/client/dashboard" className="text-sm text-white/55 hover:text-white">
        ← Dashboard
      </Link>
      <h1 className="display-tight mt-4 text-[2rem] sm:text-[2.75rem]">Tell us about your business</h1>
      <p className="mt-3 max-w-[62ch] text-white/65">
        For your {PLANS[project.plan].name} website. Answers save automatically as you type, so you can leave and come back any time. Required fields are marked.
      </p>
      {saved?.submittedAt && (
        <div className="mt-6">
          <Notice tone="success" title="Submitted">
            We have your answers. You can still update them; we&apos;ll see the latest version.
          </Notice>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <nav aria-label="Questionnaire sections" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-24 space-y-2 text-sm text-white/60">
            {ONBOARDING_SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:text-white">
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#files" className="hover:text-white">
                {ONBOARDING_SECTIONS.length + 1}. Logo and images
              </a>
            </li>
          </ol>
        </nav>
        <div className="space-y-8 lg:col-span-9">
          <OnboardingForm
            projectId={project.id}
            defaults={defaults}
            submitted={Boolean(saved?.submittedAt)}
            lastSaved={saved?.updatedAt.toISOString() ?? null}
          />
          <section id="files" aria-labelledby="files-heading" className="scroll-mt-24">
            <Panel title={<span id="files-heading">Logo and images</span>}>
              <Uploader
                projectId={project.id}
                accept={ACCEPTED_UPLOADS}
                limit={MAX_UPLOADS_PER_PROJECT}
                files={files.map((file) => ({ id: file.id, filename: file.filename, sizeBytes: file.sizeBytes, isImage: file.mime.startsWith("image/") }))}
              />
            </Panel>
          </section>
        </div>
      </div>
    </Shell>
  );
}
