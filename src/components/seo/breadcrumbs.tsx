import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./json-ld";

type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. Home is added automatically. */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-1 text-xs ${dark ? "text-bone/50" : "text-muted"}`}>
          {all.map((crumb, index) => {
            const last = index === all.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className={dark ? "text-bone/80" : "text-ink-soft"}>
                    {crumb.name}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.path} className={dark ? "hover:text-bone" : "hover:text-ink"}>
                      {crumb.name}
                    </Link>
                    <ChevronRight aria-hidden="true" className="size-3" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
