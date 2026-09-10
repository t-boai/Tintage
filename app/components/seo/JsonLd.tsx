import * as React from "react";

type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonLdProps {
  data: { [key: string]: JsonValue };
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
