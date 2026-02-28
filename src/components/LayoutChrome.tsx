"use client";

import { usePathname } from "next/navigation";
import {
  Background,
  Flex,
  RevealFx,
  opacity,
  SpacingToken,
} from "@once-ui-system/core";
import { Header, Footer, RouteGuard } from "@/components";
import { effects } from "@/resources";

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", background: "#000" }}>
        {children}
      </div>
    );
  }

  return (
    <>
      <RevealFx fill position="absolute">
        <Background
          mask={{
            x: effects.mask.x,
            y: effects.mask.y,
            radius: effects.mask.radius,
            cursor: effects.mask.cursor,
          }}
          gradient={{
            display: effects.gradient.display,
            opacity: effects.gradient.opacity as opacity,
            x: effects.gradient.x,
            y: effects.gradient.y,
            width: effects.gradient.width,
            height: effects.gradient.height,
            tilt: effects.gradient.tilt,
            colorStart: effects.gradient.colorStart,
            colorEnd: effects.gradient.colorEnd,
          }}
          dots={{
            display: effects.dots.display,
            opacity: effects.dots.opacity as opacity,
            size: effects.dots.size as SpacingToken,
            color: effects.dots.color,
          }}
          grid={{
            display: effects.grid.display,
            opacity: effects.grid.opacity as opacity,
            color: effects.grid.color,
            width: effects.grid.width,
            height: effects.grid.height,
          }}
          lines={{
            display: effects.lines.display,
            opacity: effects.lines.opacity as opacity,
            size: effects.lines.size as SpacingToken,
            thickness: effects.lines.thickness,
            angle: effects.lines.angle,
            color: effects.lines.color,
          }}
        />
      </RevealFx>
      <Flex fillWidth minHeight="16" s={{ hide: true }} />
      <Header />
      <Flex zIndex={0} fillWidth padding="l" horizontal="center" flex={1}>
        <Flex horizontal="center" fillWidth minHeight="0">
          <RouteGuard>{children}</RouteGuard>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
