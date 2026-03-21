"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

function subscribeSiteTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", callback);
  };
}

function getSiteThemeSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

type SocialCardsResponse = {
  instagram: {
    url: string;
    handle: string;
    metrics?: { followers?: number; following?: number; posts?: number };
  };
  map: {
    label: string;
    url: string;
    embedUrl: string;
    mapboxImageUrl?: string;
    mapboxImageUrlLight?: string;
    mapboxImageUrlDark?: string;
  };
  github: {
    url: string;
    handle: string;
    followers?: number;
    repos?: number;
    contributions: number[];
    contributionDays: Array<{ date: string; count: number; dateLabel: string }>;
    latestContribution?: { count: number; dateLabel: string };
  };
  spotify: { url: string; title: string; subtitle: string; albumArtUrl?: string };
  youtube: {
    url: string;
    title: string;
    subtitle: string;
    metrics?: { subscribers?: number; videos?: number };
  };
  twitter: {
    url: string;
    handle: string;
    metrics?: { followers?: number; following?: number; posts?: number };
  };
};

function buildMapEmbedUrl(lat: string, lon: string): string {
  const la = Number.parseFloat(lat);
  const lo = Number.parseFloat(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) {
    return "";
  }
  const pad = 0.012;
  const bbox = `${lo - pad},${la - pad},${lo + pad},${la + pad}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${la},${lo}`)}`;
}

const fallbackData: SocialCardsResponse = {
  instagram: {
    url: "https://www.instagram.com/harxhist",
    handle: "@harxhist",
  },
  map: {
    label: "Pacific Golf Estate, Dehradun, India",
    url: "https://www.google.com/maps/place/Pacific+Golf+Estate/@30.381226,78.1074521,17z/data=!3m1!4b1!4m6!3m5!1s0x3908d7ed01f0a4bd:0xc8ec0a3ed6a1a96!8m2!3d30.3812214!4d78.110027!16s%2Fg%2F11g9dj59rl?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
    embedUrl: buildMapEmbedUrl("30.3812214", "78.110027"),
  },
  github: {
    url: "https://github.com/harxhist",
    handle: "@harxhist",
    contributions: Array(35).fill(0),
    contributionDays: Array.from({ length: 35 }, () => ({ date: "", count: 0, dateLabel: "" })),
  },
  spotify: {
    url: "https://open.spotify.com/user/31zzi3vmybisqtjiwohgpd4l6sne?si=c8z7B9o1SC27kD-rtnLczQ",
    title: "Spotify",
    subtitle: "harxhist",
  },
  youtube: {
    url: "https://www.youtube.com/@harxhist",
    title: "YouTube",
    subtitle: "Watch on channel",
  },
  twitter: {
    url: "https://x.com/harxhist",
    handle: "@harxhist",
  },
};

function formatCompact(value: number | undefined): string | undefined {
  if (typeof value !== "number") {
    return undefined;
  }
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default function OpenBentoShowcaseGrid() {
  const [socialData, setSocialData] = useState<SocialCardsResponse>(fallbackData);
  const siteTheme = useSyncExternalStore(subscribeSiteTheme, getSiteThemeSnapshot, () => "light");

  useEffect(() => {
    let mounted = true;

    const loadSocialCards = async () => {
      try {
        const response = await fetch("/api/social-cards", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as SocialCardsResponse;
        if (mounted) {
          setSocialData(payload);
        }
      } catch {
        // Keep fallbacks when remote API lookups fail.
      }
    };

    loadSocialCards();
    return () => {
      mounted = false;
    };
  }, []);

  const instagramMeta = useMemo(() => {
    const parts: string[] = [];
    const followers = formatCompact(socialData.instagram.metrics?.followers);
    const following = formatCompact(socialData.instagram.metrics?.following);
    const posts = formatCompact(socialData.instagram.metrics?.posts);
    if (followers) {
      parts.push(`${followers} followers`);
    }
    if (following) {
      parts.push(`${following} following`);
    }
    if (posts) {
      parts.push(`${posts} posts`);
    }
    return parts.join(" • ");
  }, [socialData.instagram.metrics?.followers, socialData.instagram.metrics?.following, socialData.instagram.metrics?.posts]);

  const twitterMeta = useMemo(() => {
    const parts: string[] = [];
    const followers = formatCompact(socialData.twitter.metrics?.followers);
    const following = formatCompact(socialData.twitter.metrics?.following);
    const posts = formatCompact(socialData.twitter.metrics?.posts);
    if (followers) {
      parts.push(`${followers} followers`);
    }
    if (following) {
      parts.push(`${following} following`);
    }
    if (posts) {
      parts.push(`${posts} posts`);
    }
    return parts.join(" • ");
  }, [socialData.twitter.metrics?.followers, socialData.twitter.metrics?.following, socialData.twitter.metrics?.posts]);

  const youtubeMeta = useMemo(() => {
    const parts: string[] = [];
    const subscribers = formatCompact(socialData.youtube.metrics?.subscribers);
    const videos = formatCompact(socialData.youtube.metrics?.videos);
    if (subscribers) {
      parts.push(`${subscribers} subscribers`);
    }
    if (videos) {
      parts.push(`${videos} videos`);
    }
    return parts.join(" • ");
  }, [socialData.youtube.metrics?.subscribers, socialData.youtube.metrics?.videos]);

  const mapboxDisplayUrl = useMemo(() => {
    const m = socialData.map;
    if (siteTheme === "dark") {
      return m.mapboxImageUrlDark ?? m.mapboxImageUrl ?? m.mapboxImageUrlLight;
    }
    return m.mapboxImageUrlLight ?? m.mapboxImageUrl ?? m.mapboxImageUrlDark;
  }, [
    siteTheme,
    socialData.map.mapboxImageUrl,
    socialData.map.mapboxImageUrlDark,
    socialData.map.mapboxImageUrlLight,
  ]);

  return (
    <div className="showcase-grid">
      <div className="showcase-card showcase-card-sm showcase-card-github showcase-bento-instagram">
        <a
          href={socialData.instagram.url}
          className="showcase-card-inner showcase-social showcase-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <div
            className="showcase-icon"
            style={{
              background:
                "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
          <span className="showcase-label">Instagram</span>
          <span className="showcase-handle">
            {socialData.instagram.handle}
            {instagramMeta ? ` • ${instagramMeta}` : ""}
          </span>
          <span className="showcase-follow-btn" style={{ background: "#e1306c" }}>
            Follow
          </span>
        </a>
      </div>

      <div className="showcase-card showcase-card-lg showcase-bento-cv">
        <div className="showcase-card-inner showcase-text">
          <span className="showcase-text-title">About</span>
          <span className="showcase-text-body">
            Engineer by trade, ambivert by nature. IITK undergrad, average grades, zero regrets. I'll rash-drive at 140 to a 10-day silent meditation retreat and call it balance. Jack of all sports, master of none. Occasional drinker, full-time contradiction. 25, single, cute & open-minded. A fundamentalist still learning the middle ground.
          </span>
        </div>
      </div>

      <div className="showcase-card showcase-card-sm showcase-card-github showcase-bento-github">
        <a
          href={socialData.github.url}
          className="showcase-card-inner showcase-github showcase-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <div className="showcase-github-header">
            <div className="showcase-icon" style={{ background: "#24292f" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="showcase-github-meta">
              <span className="showcase-label">GitHub</span>
              <span className="showcase-handle">{socialData.github.handle}</span>
            </div>
          </div>
          <div className="showcase-github-graph">
            {socialData.github.contributions.map((level, i) => {
              const day = socialData.github.contributionDays[i];
              const count = day?.count ?? 0;
              const column = i % 7;
              const edgeClass =
                column <= 1
                  ? "showcase-github-dot-tooltip-right"
                  : column >= 5
                    ? "showcase-github-dot-tooltip-left"
                    : "showcase-github-dot-tooltip-center";
              const label =
                day?.dateLabel && count >= 0
                  ? `${count} ${count === 1 ? "contribution" : "contributions"} on ${day.dateLabel}`
                  : "No contribution data";

              return (
                <div
                  key={i}
                  className={`showcase-github-dot ${edgeClass} showcase-github-dot-level-${Math.min(4, Math.max(0, level))}`}
                  data-tooltip={label}
                  aria-label={label}
                />
              );
            })}
          </div>
        </a>
      </div>

      <div className="showcase-card showcase-card-lg showcase-bento-spotify">
        <a
          href={socialData.spotify.url}
          className={`showcase-card-inner showcase-spotify showcase-card-link${socialData.spotify.albumArtUrl ? " showcase-spotify--has-art" : ""}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open Spotify — ${socialData.spotify.title}`}
        >
          {socialData.spotify.albumArtUrl ? (
            <div className="showcase-spotify-art-bg" aria-hidden>
              <img
                className="showcase-spotify-art-full"
                src={socialData.spotify.albumArtUrl}
                alt=""
                loading="lazy"
              />
              <div className="showcase-spotify-scrim" />
            </div>
          ) : null}
          <div className="showcase-spotify-brand" aria-hidden>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white" aria-hidden>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <div
            className={`showcase-spotify-body ${socialData.spotify.albumArtUrl ? "showcase-spotify-body--art" : "showcase-spotify-body--plain"}`}
          >
            <div className="showcase-spotify-content">
              <div className="showcase-spotify-info">
                <span className="showcase-spotify-track">{socialData.spotify.title}</span>
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="showcase-card showcase-card-lg showcase-bento-photo">
        <div className="showcase-card-inner showcase-image">
          <img
            className="showcase-image-media"
            src="/images/gallery/horizontal-0.jpg"
            alt="Showcase image"
          />
        </div>
      </div>

      <div className="showcase-card showcase-card-sm showcase-bento-twitter">
        <a
          href={socialData.twitter.url}
          className="showcase-card-inner showcase-link showcase-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <div className="showcase-icon" style={{ background: "#0f1419" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.645h2.039L6.486 3.24H4.298z" />
            </svg>
          </div>
          <span className="showcase-label">Twitter / X</span>
          <span className="showcase-handle">
            {socialData.twitter.handle}
            {twitterMeta ? ` • ${twitterMeta}` : ""}
          </span>
          <svg className="showcase-link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>

      <div className="showcase-card showcase-card-sm showcase-bento-youtube">
        <a
          href={socialData.youtube.url}
          className="showcase-card-inner showcase-youtube showcase-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <div className="showcase-icon" style={{ background: "#ff0000" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a2.975 2.975 0 00-2.095-2.103C19.555 3.5 12 3.5 12 3.5s-7.555 0-9.403.583A2.975 2.975 0 00.502 6.186 31.54 31.54 0 000 12a31.54 31.54 0 00.502 5.814 2.975 2.975 0 002.095 2.103C4.445 20.5 12 20.5 12 20.5s7.555 0 9.403-.583a2.975 2.975 0 002.095-2.103A31.54 31.54 0 0024 12a31.54 31.54 0 00-.502-5.814zM9.6 15.568V8.432L15.84 12 9.6 15.568z" />
            </svg>
          </div>
          <span className="showcase-label">YouTube</span>
          <span className="showcase-handle">
            {socialData.youtube.subtitle}
            {youtubeMeta ? ` • ${youtubeMeta}` : ""}
          </span>
          <span className="showcase-follow-btn" style={{ background: "#ff0000" }}>
            {socialData.youtube.title}
          </span>
        </a>
      </div>

      <div className="showcase-card showcase-card-sm showcase-bento-quote">
        <div className="showcase-card-inner showcase-quote">
          <span className="showcase-quote-mark">"</span>
          <span className="showcase-text-body">
            God doesn't sit on the jury in the Devil's Advocate's courtroom.
          </span>
        </div>
      </div>

      <div className="showcase-card showcase-card-lg showcase-bento-map">
        <a
          href={socialData.map.url}
          className="showcase-card-inner showcase-map showcase-card-link"
          target="_blank"
          rel="noreferrer"
        >
          <div className="showcase-map-bg">
            {mapboxDisplayUrl ? (
              <img
                className="showcase-map-image"
                src={mapboxDisplayUrl}
                alt={socialData.map.label}
                loading="lazy"
              />
            ) : socialData.map.embedUrl ? (
              <iframe
                className="showcase-map-iframe"
                src={socialData.map.embedUrl}
                title={socialData.map.label}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <svg
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="showcase-map-svg"
              >
                <rect width="400" height="200" fill="#e8f4f8" />
                <path d="M0 120 Q100 80 200 110 T400 90" stroke="#b8d4e3" strokeWidth="2" fill="none" />
                <path
                  d="M0 140 Q150 100 250 130 T400 110"
                  stroke="#c8dae3"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="200" cy="100" r="6" fill="#10b981" />
                <circle cx="200" cy="100" r="12" fill="#10b981" opacity="0.2" />
                <circle cx="200" cy="100" r="20" fill="#10b981" opacity="0.1" />
              </svg>
            )}
          </div>
          <div className="showcase-map-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {socialData.map.label}
          </div>
        </a>
      </div>
    </div>
  );
}
