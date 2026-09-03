"use client";
import * as React from "react";
// Icon
import { Search } from "lucide-react";
import { Field } from "@/components/ui/field";

// Shad
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQueryFromUrl = searchParams?.get("q") || "";

  const [query, setQuery] = React.useState(currentQueryFromUrl);
  const [prevUrlQuery, setPrevUrlQuery] = React.useState(currentQueryFromUrl);

  if (prevUrlQuery !== currentQueryFromUrl) {
    setPrevUrlQuery(currentQueryFromUrl);
    setQuery(currentQueryFromUrl);
  }

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
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
        <InputGroup className="group rounded-2xl border-2 border-[#DDDDDD] transition-all duration-200 focus-within:border-(--primaryCus) focus-within:ring-4 focus-within:ring-(--primaryCus)/20 hover:border-(--primaryCus)/50">
          <InputGroupInput
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm áo thun, giày boot..."
            className="h-full border-none focus-visible:ring-0 focus-visible:outline-none"
          />
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer rounded-full bg-(--primaryCus) p-2 text-white transition-all duration-200 hover:bg-(--primaryCus)/85 active:scale-90"
          >
            <Search className="" />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  );
}
