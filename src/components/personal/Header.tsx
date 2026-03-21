"use client";

import { Fade, Flex, Line, Row, ToggleButton } from "@once-ui-system/core";
import { bioPage, display, gallery, person, routes } from "@/resources";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "@/components/Header.module.scss";

type PersonalHeaderProps = {
  pathname: string;
};

export function PersonalHeader({ pathname }: PersonalHeaderProps) {
  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{ position: "fixed" }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Row s={{ hide: true }}>{person.location}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Row gap="4" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              {routes["/"] && <ToggleButton prefixIcon="home" href="/" selected={pathname === "/"} />}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {routes["/bio"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="person"
                      href="/bio"
                      label={bioPage.label}
                      selected={pathname.startsWith("/bio")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="person"
                      href="/bio"
                      selected={pathname.startsWith("/bio")}
                    />
                  </Row>
                </>
              )}
              {routes["/gallery"] && (
                <>
                  <Row s={{ hide: true }}>
                    <ToggleButton
                      prefixIcon="gallery"
                      href="/gallery"
                      label={gallery.label}
                      selected={pathname.startsWith("/gallery")}
                    />
                  </Row>
                  <Row hide s={{ hide: false }}>
                    <ToggleButton
                      prefixIcon="gallery"
                      href="/gallery"
                      selected={pathname.startsWith("/gallery")}
                    />
                  </Row>
                </>
              )}
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
            </Row>
          </Row>
        </Row>
        <Flex fillWidth />
      </Row>
    </>
  );
}
