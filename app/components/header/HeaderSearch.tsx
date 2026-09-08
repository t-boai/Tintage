"use client";
import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Shad
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Field } from "@/components/ui/field";

export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = React.useTransition();

  const currentQueryFromUrl = searchParams?.get("q") || "";

  const [query, setQuery] = React.useState(currentQueryFromUrl);
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(currentQueryFromUrl);

  if (prevUrlQuery !== currentQueryFromUrl) {
    setPrevUrlQuery(currentQueryFromUrl);
    setQuery(currentQueryFromUrl);
  }

  const handleSearch = () => {
    if (isPending) return;

    const trimmedQuery = query.trim();

    const targetUrl = trimmedQuery
      ? `/search?q=${encodeURIComponent(trimmedQuery)}`
      : "/search";

    const currentFullUrl = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    if (currentFullUrl === targetUrl) return;

    startTransition(() => {
      router.push(targetUrl);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-100 lg:max-w-125">
      <Field className="">
        <InputGroup
          className={`group rounded-2xl border-2 border-[#DDDDDD] transition-all duration-200 focus-within:border-(--primaryCus) focus-within:ring-4 focus-within:ring-(--primaryCus)/20 hover:border-(--primaryCus)/50 ${
            isPending ? "pointer-events-none opacity-70" : ""
          }`}
        >
          <InputGroupInput
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            placeholder="Tìm kiếm áo thun, giày boot..."
            className="h-full border-none focus-visible:ring-0 focus-visible:outline-none disabled:bg-transparent"
          />
          <InputGroupAddon
            align="inline-end"
            onClick={handleSearch}
            className={`flex cursor-pointer items-center justify-center rounded-full p-2 text-white transition-all duration-200 active:scale-90 ${
              isPending
                ? "bg-neutral-400"
                : "bg-(--primaryCus) hover:bg-(--primaryCus)/85"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
