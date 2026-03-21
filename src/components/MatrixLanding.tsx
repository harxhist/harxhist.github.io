"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MatrixRain } from "./MatrixRain";
import { SkullLinesBackground } from "./SkullLinesBackground";
import type { Landing } from "@/types";
import styles from "./MatrixLanding.module.scss";

const matrixGreen = "#00ff41";
/** Reticle when hovering links */
const cursorRed = "#ff3333";
const cursorRedCore = "#cc2222";
const matrixDim = "rgba(0, 255, 65, 0.6)";
const matrixFaint = "rgba(0, 255, 65, 0.35)";

function useMatrixCustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      const fine =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(fine);
    };
    update();
    const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqFine.addEventListener("change", update);
    mqMotion.addEventListener("change", update);
    return () => {
      mqFine.removeEventListener("change", update);
      mqMotion.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}

export function MatrixLanding({ data }: { data: Landing }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const customCursor = useMatrixCustomCursor();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [overLink, setOverLink] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !customCursor) return;

    const onMove = (e: MouseEvent) => {
      setPointer({ x: e.clientX, y: e.clientY });
      const t = e.target;
      if (t instanceof Element) {
        const a = t.closest("a");
        setOverLink(a !== null && el.contains(a));
      } else {
        setOverLink(false);
      }
    };
    const onLeave = () => {
      setPointer(null);
      setOverLink(false);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [customCursor]);

  return (
    <div
      ref={rootRef}
      className={`${styles.root} matrix-landing ${customCursor ? styles.customCursor : ""}`}
    >
      {customCursor && pointer !== null && (
        <div
          className={`${styles.reticle} ${overLink ? styles.reticleLink : ""}`}
          style={{
            left: pointer.x,
            top: pointer.y,
            transform: "translate(-50%, -50%)",
          }}
          aria-hidden
        >
          <div className={styles.reticleGlowOuter} />
          <div className={styles.reticleGlowInner} />
          <svg
            className={styles.reticleSvg}
            viewBox="0 0 32 32"
            width={28}
            height={28}
            aria-hidden
          >
            <line
              x1="16"
              y1="0"
              x2="16"
              y2="13"
              stroke={overLink ? cursorRed : matrixGreen}
              strokeWidth={overLink ? 1.35 : 1}
            />
            <line
              x1="16"
              y1="19"
              x2="16"
              y2="32"
              stroke={overLink ? cursorRed : matrixGreen}
              strokeWidth={overLink ? 1.35 : 1}
            />
            <line
              x1="0"
              y1="16"
              x2="13"
              y2="16"
              stroke={overLink ? cursorRed : matrixGreen}
              strokeWidth={overLink ? 1.35 : 1}
            />
            <line
              x1="19"
              y1="16"
              x2="32"
              y2="16"
              stroke={overLink ? cursorRed : matrixGreen}
              strokeWidth={overLink ? 1.35 : 1}
            />
            <circle
              cx="16"
              cy="16"
              r={overLink ? 2.75 : 2}
              fill={overLink ? cursorRedCore : matrixGreen}
            />
          </svg>
        </div>
      )}
      <SkullLinesBackground />
      <MatrixRain />
      <main
        className={`${styles.main} matrix-content`}
        style={{
          color: matrixGreen,
        }}
      >
        {data.topLabel && (
          <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: matrixFaint }}>
            {data.topLabel}
          </p>
        )}
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            fontWeight: 600,
            marginBottom: "0.25rem",
            letterSpacing: "0.02em",
          }}
        >
          {data.displayName}
        </h1>
        {data.tagline && (
          <p style={{ marginBottom: "0.5rem", color: matrixGreen, fontSize: "0.95rem" }}>
            {data.tagline}
          </p>
        )}
        {data.fixedAddress && (
          <p style={{ marginBottom: "0.5rem", color: matrixFaint, fontSize: "0.9rem" }}>
            {data.fixedAddress}
          </p>
        )}
        <p style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
          {data.bio}
        </p>
        {data.cta && (
          <p style={{ marginBottom: "0.5rem", color: matrixDim }}>
            {data.cta}
          </p>
        )}
        {data.currentStatus && (
          <p style={{ marginBottom: "1.5rem", color: matrixGreen }}>
            {data.currentStatus}
          </p>
        )}
        {data.highlight && (
          <p style={{ marginBottom: "1rem", color: matrixGreen }}>
            {data.highlight.icon}{" "}
            {data.highlight.href ? (
              <Link
                href={data.highlight.href}
                className="matrix-link"
                style={{ color: matrixDim, textDecoration: "none" }}
              >
                {data.highlight.title}
              </Link>
            ) : (
              data.highlight.title
            )}
          </p>
        )}
        {data.interests && (
          <p style={{ marginBottom: "1rem", lineHeight: 1.6, color: matrixGreen }}>
            {data.interests}
          </p>
        )}
        
        {data.dislikes && (
          <p style={{ marginBottom: "1.5rem", color: matrixGreen, lineHeight: 1.5 }}>
            {data.dislikes}
          </p>
        )}
        
      
        {data.primaryLinks && data.primaryLinks.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <p style={{ marginBottom: "0.5rem", color: matrixDim }}>
              <strong style={{ color: matrixGreen }}>take a look at</strong>
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.primaryLinks.map((item, i) => (
                <li key={i} style={{ marginBottom: "0.25rem" }}>
                  <Link
                    href={item.href}
                    className="matrix-link"
                    style={{
                      color: matrixGreen,
                      textDecoration: "none",
                    }}
                  >
                    * {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        {data.linksSectionTitle && data.linkItems && data.linkItems.length > 0 && (
          <section style={{ marginBottom: "1.5rem" }}>
            <p style={{ marginBottom: "0.5rem", color: matrixFaint }}>
              <strong style={{ color: matrixGreen }}>{data.linksSectionTitle}</strong>
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.linkItems.map((item, i) => (
                <li key={i} style={{ marginBottom: "0.25rem" }}>
                  <Link
                    href={item.href}
                    className="matrix-link"
                    style={{
                      color: matrixGreen,
                      textDecoration: "none",
                    }}
                  >
                    * {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: `1px solid ${matrixFaint}`,
          }}
        >
          <Link
            href="/bio"
            className="matrix-link"
            style={{
              color: matrixGreen,
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            → personal (bio · gallery)
          </Link>
          <br />
          <Link
            href="/cv"
            className="matrix-link"
            style={{
              color: matrixGreen,
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            → portfolio (CV · projects)
          </Link>
        </section>
      </main>
    </div>
  );
}
