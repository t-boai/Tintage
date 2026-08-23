"use client";

import * as React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function LenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  React.useEffect(() => {
    if (!lenis) return;

    lenis.scrollTo(0, { immediate: true });

    const timer = setTimeout(() => {
      lenis.resize();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, autoRaf: true }}
    >
      <LenisRouteHandler />
      {children}
    </ReactLenis>
  );
}
