import * as React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadCrumbsProps {
  items: BreadcrumbItem[];
}

export default function BreadCrumbs({ items }: BreadCrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold tracking-wider text-neutral-500">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={`breadcrumb-${idx}`}>
            {idx > 0 && <span className="text-neutral-300">/</span>}
            <Link
              href={item.href}
              className={
                isLast
                  ? "pointer-events-none rounded-md bg-neutral-900 px-2 py-0.5 text-white" // Item cuối không cho click
                  : "transition-colors hover:text-(--primaryCus)"
              }
            >
              {item.label}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
