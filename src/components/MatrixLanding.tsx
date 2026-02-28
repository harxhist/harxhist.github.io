"use client";

import Link from "next/link";
import { MatrixRain } from "./MatrixRain";
import { SkullLinesBackground } from "./SkullLinesBackground";
import type { Landing } from "@/types";

const matrixGreen = "#00ff41";
const matrixDim = "rgba(0, 255, 65, 0.6)";
const matrixFaint = "rgba(0, 255, 65, 0.35)";

export function MatrixLanding({ data }: { data: Landing }) {
  return (
    <div className="matrix-landing">
      <SkullLinesBackground />
      <MatrixRain />
      <main
        className="matrix-content"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          padding: "clamp(2rem, 6vw, 4rem)",
          fontFamily: "var(--font-code), monospace",
          color: matrixGreen,
          maxWidth: "42rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
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
            href="/about"
            className="matrix-link"
            style={{
              color: matrixGreen,
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            → View portfolio (about · work · gallery)
          </Link>
        </section>
      </main>
    </div>
  );
}
