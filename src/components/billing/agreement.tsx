import type { AgreementDocument } from "@/content/agreements";

/** The agreement exactly as it's recorded on acceptance, in a scrollable, keyboard-focusable region. */
export function AgreementView({ doc, id, height = "h-80" }: { doc: AgreementDocument; id: string; height?: string }) {
  return (
    <div>
      <div
        id={id}
        role="region"
        aria-label={`${doc.title}, version ${doc.version}`}
        tabIndex={0}
        className={`${height} overflow-y-auto border border-night-line bg-night px-5 py-5 text-[14px] leading-relaxed text-white/80`}
      >
        <p className="text-base font-semibold text-white">{doc.title}</p>
        <p className="mt-1 text-xs text-white/50">
          Version {doc.version}
          {doc.status === "draft" && " · Template pending legal review"}
        </p>
        {doc.sections.map((section) => (
          <div key={section.title} className="mt-5">
            <p className="font-semibold text-white">{section.title}</p>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="mt-2">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
