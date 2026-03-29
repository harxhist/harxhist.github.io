import { NextResponse } from "next/server";

export const dynamic = "force-static";

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
    /** Inlined at build time so the browser never calls Mapbox (avoids token URL / Referer blocks). */
    mapboxImageDataUrlLight?: string;
    mapboxImageDataUrlDark?: string;
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

const accounts = {
  instagramHandle: "harxhist",
  githubHandle: "harxhist",
  youtubeHandle: "harxhist",
  twitterHandle: "harxhist",
  instagram: "https://www.instagram.com/harxhist",
  github: "https://github.com/harxhist",
  spotify: "https://open.spotify.com/user/31zzi3vmybisqtjiwohgpd4l6sne?si=c8z7B9o1SC27kD-rtnLczQ",
  youtube: "https://www.youtube.com/@harxhist",
  twitter: "https://x.com/harxhist",
  mapQuery: "Pacific Golf Estate, Dehradun, India",
  mapCoordinates: { lat: "30.3812214", lon: "78.110027" },
  mapUrl:
    "https://www.google.com/maps/place/Pacific+Golf+Estate/@30.381226,78.1074521,17z/data=!3m1!4b1!4m6!3m5!1s0x3908d7ed01f0a4bd:0xc8ec0a3ed6a1a96!8m2!3d30.3812214!4d78.110027!16s%2Fg%2F11g9dj59rl?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D",
} as const;

/**
 * Spotify oEmbed supports tracks, albums, playlists, and artists — not user profile URLs (400).
 * Set `SPOTIFY_OEMBED_URL` to a public playlist, artist, album, or track to populate title, author, and art.
 * The card link still uses `accounts.spotify` (profile) when that is a profile URL.
 */
const SPOTIFY_OEMBED_URL = process.env.SPOTIFY_OEMBED_URL?.trim();

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

/** Empty `MAPBOX_STYLE=` in .env or an empty GitHub secret is `""`, which `??` does not replace — that yields `/v1//static/` and Mapbox 404. */
function mapboxStyleOrDefault(raw: string | undefined, fallback: string): string {
  const t = raw?.trim();
  return t || fallback;
}

/** Light UI — default `mapbox/streets-v12`. Override with `MAPBOX_STYLE`. */
const MAPBOX_STYLE_LIGHT = mapboxStyleOrDefault(process.env.MAPBOX_STYLE, "mapbox/streets-v12");
/** Dark UI — default `mapbox/dark-v11`. Override with `MAPBOX_STYLE_DARK`. */
const MAPBOX_STYLE_DARK = mapboxStyleOrDefault(process.env.MAPBOX_STYLE_DARK, "mapbox/dark-v11");

type MapUiTheme = "light" | "dark";

/**
 * Mapbox Static Images API — sharp map + pin. Requires `MAPBOX_ACCESS_TOKEN` in env.
 * Style follows site theme (`?theme=dark|light` from the client).
 * @see https://docs.mapbox.com/api/maps/static-images/
 */
function buildMapboxStaticImageUrl(lat: string, lon: string, uiTheme: MapUiTheme): string | undefined {
  if (!MAPBOX_ACCESS_TOKEN) {
    return undefined;
  }
  const la = Number.parseFloat(lat);
  const lo = Number.parseFloat(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) {
    return undefined;
  }
  const style = uiTheme === "dark" ? MAPBOX_STYLE_DARK : MAPBOX_STYLE_LIGHT;
  const zoom = 16;
  const width = 800;
  const height = 500;
  const overlay = `pin-s+e11d48(${lo},${la})`;
  const center = `${lo},${la},${zoom}`;
  const path = `https://api.mapbox.com/styles/v1/${style}/static/${overlay}/${center}/${width}x${height}@2x`;
  return `${path}?access_token=${encodeURIComponent(MAPBOX_ACCESS_TOKEN)}`;
}

/** Load static map on the server during build — keeps tokens off the public JSON and avoids browser Referer rules. */
async function fetchMapboxAsDataUrl(imageUrl: string): Promise<string | undefined> {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "harxh-portfolio/1.0 (next-build; https://github.com/harxhist/harxhist.github.io)",
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const rawType = res.headers.get("content-type")?.split(";")[0]?.trim();
    const mime = rawType?.startsWith("image/") ? rawType : "image/png";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return undefined;
  }
}

/** OSM embed — fallback when Mapbox token is not set. */
function buildMapEmbedUrl(lat: string, lon: string): string {
  const la = Number.parseFloat(lat);
  const lo = Number.parseFloat(lon);
  if (!Number.isFinite(la) || !Number.isFinite(lo)) {
    return "";
  }
  const pad = 0.012;
  const minLon = lo - pad;
  const maxLon = lo + pad;
  const minLat = la - pad;
  const maxLat = la + pad;
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${la},${lo}`)}`;
}

const fallbackData: SocialCardsResponse = {
  instagram: {
    url: accounts.instagram,
    handle: "@harxhist",
  },
  map: {
    label: accounts.mapQuery,
    url: accounts.mapUrl,
    embedUrl: buildMapEmbedUrl(accounts.mapCoordinates.lat, accounts.mapCoordinates.lon),
  },
  github: {
    url: accounts.github,
    handle: "@harxhist",
    contributions: Array(35).fill(0),
    contributionDays: Array(35).fill({ date: "", count: 0, dateLabel: "" }),
  },
  spotify: {
    url: accounts.spotify,
    title: "Spotify",
    subtitle: "harxhist",
  },
  youtube: {
    url: accounts.youtube,
    title: "Subscribe",
    subtitle: "@harxhist",
  },
  twitter: {
    url: accounts.twitter,
    handle: "@harxhist",
  },
};

const RAPID_API_HOST = process.env.RAPIDAPI_HOST;
const RAPID_API_KEY = process.env.RAPIDAPI_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function isSpotifyUserProfileUrl(url: string): boolean {
  return /open\.spotify\.com\/(intl-[a-z]{2}\/)?user\//i.test(url);
}

function resolveSpotifyOembedTarget(): string | undefined {
  if (SPOTIFY_OEMBED_URL) {
    return SPOTIFY_OEMBED_URL;
  }
  if (!isSpotifyUserProfileUrl(accounts.spotify)) {
    return accounts.spotify;
  }
  return undefined;
}

function fetchSpotifyOembed(): Promise<Response> {
  const target = resolveSpotifyOembedTarget();
  if (!target) {
    return Promise.resolve(new Response(null, { status: 400 }));
  }
  return fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(target)}`);
}

function parseInteger(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d]/g, "");
    if (!normalized) {
      return undefined;
    }
    const parsed = Number.parseInt(normalized, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizeContributionLevel(count: number, max: number): number {
  if (count <= 0 || max <= 0) {
    return 0;
  }
  const ratio = count / max;
  if (ratio <= 0.25) {
    return 1;
  }
  if (ratio <= 0.5) {
    return 2;
  }
  if (ratio <= 0.75) {
    return 3;
  }
  return 4;
}

function formatOrdinalDay(day: number): string {
  const mod10 = day % 10;
  const mod100 = day % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${day}st`;
  }
  if (mod10 === 2 && mod100 !== 12) {
    return `${day}nd`;
  }
  if (mod10 === 3 && mod100 !== 13) {
    return `${day}rd`;
  }
  return `${day}th`;
}

function formatContributionDate(dateValue: string): string {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }
  const day = formatOrdinalDay(parsed.getUTCDate());
  const month = parsed.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
  const year = parsed.getUTCFullYear();
  return `${day} ${month}, ${year}`;
}

async function fetchGithubContributions(
  handle: string,
): Promise<
  | {
      levels: number[];
      days: Array<{ date: string; count: number; dateLabel: string }>;
      latestContribution?: { count: number; dateLabel: string };
    }
  | undefined
> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(handle)}`,
    );
    if (!response.ok) {
      return undefined;
    }
    const payload = (await response.json()) as {
      contributions?: Array<{ date?: string; count?: number }>;
    };

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Build a lookup map of date → count from the API response.
    const lookup = new Map<string, number>();
    for (const item of payload.contributions ?? []) {
      if (!item.date) continue;
      const parsed = new Date(item.date);
      if (Number.isNaN(parsed.getTime())) continue;
      parsed.setUTCHours(0, 0, 0, 0);
      // Exclude future dates.
      if (parsed > today) continue;
      lookup.set(item.date, Math.max(0, item.count ?? 0));
    }

    if (lookup.size === 0) {
      return undefined;
    }

    // Fill exactly 35 days ending on today, inserting zeros for any missing dates.
    // This ensures trailing empty days (e.g. today and yesterday with no commits)
    // are always present in the grid rather than being silently dropped.
    const filledDays: Array<{ date: string; count: number; dateLabel: string }> = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const count = lookup.get(key) ?? 0;
      filledDays.push({
        date: key,
        count,
        dateLabel: formatContributionDate(key),
      });
    }

    const max = Math.max(...filledDays.map((d) => d.count));
    const levels = filledDays.map((d) => normalizeContributionLevel(d.count, max));

    // latestContribution: most recent day with count > 0.
    const latestNonZero = [...filledDays].reverse().find((d) => d.count > 0);

    return {
      levels,
      days: filledDays,
      latestContribution: latestNonZero
        ? { count: latestNonZero.count, dateLabel: latestNonZero.dateLabel }
        : undefined,
    };
  } catch {
    return undefined;
  }
}

async function fetchInstagramMetrics(handle: string) {
  if (!RAPID_API_HOST || !RAPID_API_KEY) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://${RAPID_API_HOST}/api/v1/user/by_username?username=${encodeURIComponent(handle)}`,
      {
        headers: {
          "x-rapidapi-host": RAPID_API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
      },
    );
    if (!response.ok) {
      return undefined;
    }
    const payload = (await response.json()) as {
      data?: { edge_followed_by?: { count?: number }; edge_follow?: { count?: number }; edge_owner_to_timeline_media?: { count?: number } };
      follower_count?: number | string;
      following_count?: number | string;
      media_count?: number | string;
    };

    return {
      followers:
        parseInteger(payload.data?.edge_followed_by?.count) ?? parseInteger(payload.follower_count),
      following:
        parseInteger(payload.data?.edge_follow?.count) ?? parseInteger(payload.following_count),
      posts:
        parseInteger(payload.data?.edge_owner_to_timeline_media?.count) ??
        parseInteger(payload.media_count),
    };
  } catch {
    return undefined;
  }
}

async function fetchTwitterMetrics(handle: string) {
  if (!RAPID_API_HOST || !RAPID_API_KEY) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://${RAPID_API_HOST}/user/details?username=${encodeURIComponent(handle)}`,
      {
        headers: {
          "x-rapidapi-host": RAPID_API_HOST,
          "x-rapidapi-key": RAPID_API_KEY,
        },
      },
    );
    if (!response.ok) {
      return undefined;
    }
    const payload = (await response.json()) as {
      data?: {
        followers_count?: number | string;
        friends_count?: number | string;
        statuses_count?: number | string;
      };
      followers_count?: number | string;
      following_count?: number | string;
      tweet_count?: number | string;
    };

    return {
      followers:
        parseInteger(payload.data?.followers_count) ?? parseInteger(payload.followers_count),
      following:
        parseInteger(payload.data?.friends_count) ?? parseInteger(payload.following_count),
      posts:
        parseInteger(payload.data?.statuses_count) ?? parseInteger(payload.tweet_count),
    };
  } catch {
    return undefined;
  }
}

async function fetchYouTubeMetrics(handle: string) {
  if (!YOUTUBE_API_KEY) {
    return undefined;
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`,
    );
    if (!response.ok) {
      return undefined;
    }
    const payload = (await response.json()) as {
      items?: Array<{
        snippet?: { title?: string; customUrl?: string };
        statistics?: { subscriberCount?: string; videoCount?: string };
      }>;
    };
    const channel = payload.items?.[0];
    if (!channel) {
      return undefined;
    }
    return {
      title: channel.snippet?.title,
      subtitle: channel.snippet?.customUrl ? `@${channel.snippet.customUrl.replace(/^@/, "")}` : undefined,
      subscribers: parseInteger(channel.statistics?.subscriberCount),
      videos: parseInteger(channel.statistics?.videoCount),
    };
  } catch {
    return undefined;
  }
}

export async function GET() {
  const [githubRes, githubContributions, spotifyRes, youtubeRes, youtubeMetrics, mapRes, instagramMetrics, twitterMetrics] =
    await Promise.allSettled([
    fetch(`https://api.github.com/users/${accounts.githubHandle}`, {
      headers: { Accept: "application/vnd.github+json" },
    }),
    fetchGithubContributions(accounts.githubHandle),
    fetchSpotifyOembed(),
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(accounts.youtube)}&format=json`),
    fetchYouTubeMetrics(accounts.youtubeHandle),
    fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(accounts.mapQuery)}`,
      {
        headers: { "User-Agent": "harxh-portfolio/1.0" },
      },
    ),
    fetchInstagramMetrics(accounts.instagramHandle),
    fetchTwitterMetrics(accounts.twitterHandle),
  ]);

  const response: SocialCardsResponse = { ...fallbackData };
  if (githubContributions.status === "fulfilled" && githubContributions.value) {
    response.github.contributions = githubContributions.value.levels;
    response.github.contributionDays = githubContributions.value.days;
    response.github.latestContribution = githubContributions.value.latestContribution;
  }

  if (githubRes.status === "fulfilled" && githubRes.value.ok) {
    const github = (await githubRes.value.json()) as {
      login?: string;
      followers?: number;
      public_repos?: number;
      html_url?: string;
    };
    response.github = {
      url: github.html_url || fallbackData.github.url,
      handle: github.login ? `@${github.login}` : fallbackData.github.handle,
      followers: github.followers,
      repos: github.public_repos,
      contributions: response.github.contributions,
      contributionDays: response.github.contributionDays,
      latestContribution: response.github.latestContribution,
    };
  }

  if (spotifyRes.status === "fulfilled" && spotifyRes.value.ok) {
    const spotify = (await spotifyRes.value.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
    response.spotify = {
      url: accounts.spotify,
      title: spotify.title || fallbackData.spotify.title,
      subtitle: spotify.author_name || fallbackData.spotify.subtitle,
      albumArtUrl: spotify.thumbnail_url,
    };
  }

  if (youtubeRes.status === "fulfilled" && youtubeRes.value.ok) {
    const youtube = (await youtubeRes.value.json()) as {
      title?: string;
      author_name?: string;
      author_url?: string;
    };
    response.youtube = {
      url: youtube.author_url || accounts.youtube,
      title: "Subscribe",
      subtitle: youtube.author_name || fallbackData.youtube.subtitle,
    };
    if (youtube.title) {
      response.youtube.title = youtube.title;
    }
  }

  if (youtubeMetrics.status === "fulfilled" && youtubeMetrics.value) {
    response.youtube.metrics = {
      subscribers: youtubeMetrics.value.subscribers,
      videos: youtubeMetrics.value.videos,
    };
    if (youtubeMetrics.value.title) {
      response.youtube.title = youtubeMetrics.value.title;
    }
    if (youtubeMetrics.value.subtitle) {
      response.youtube.subtitle = youtubeMetrics.value.subtitle;
    }
  }

  let mapLat: string = accounts.mapCoordinates.lat;
  let mapLon: string = accounts.mapCoordinates.lon;

  if (mapRes.status === "fulfilled" && mapRes.value.ok) {
    const map = (await mapRes.value.json()) as Array<{ display_name?: string; lat?: string; lon?: string }>;
    const place = map[0];
    if (place) {
      if (place.lat) {
        mapLat = place.lat;
      }
      if (place.lon) {
        mapLon = place.lon;
      }
      const normalized = place.display_name?.split(",").slice(0, 2).join(", ");
      response.map = {
        label: normalized || fallbackData.map.label,
        url: fallbackData.map.url,
        embedUrl: buildMapEmbedUrl(mapLat, mapLon),
      };
    }
  }

  if (!response.map.embedUrl) {
    response.map.embedUrl = buildMapEmbedUrl(accounts.mapCoordinates.lat, accounts.mapCoordinates.lon);
  }

  const mapboxLightUrl = buildMapboxStaticImageUrl(mapLat, mapLon, "light");
  const mapboxDarkUrl = buildMapboxStaticImageUrl(mapLat, mapLon, "dark");
  if (mapboxLightUrl || mapboxDarkUrl) {
    const [dataLight, dataDark] = await Promise.all([
      mapboxLightUrl ? fetchMapboxAsDataUrl(mapboxLightUrl) : Promise.resolve(undefined),
      mapboxDarkUrl ? fetchMapboxAsDataUrl(mapboxDarkUrl) : Promise.resolve(undefined),
    ]);
    if (dataLight) {
      response.map.mapboxImageDataUrlLight = dataLight;
    }
    if (dataDark) {
      response.map.mapboxImageDataUrlDark = dataDark;
    }
  }

  if (instagramMetrics.status === "fulfilled" && instagramMetrics.value) {
    response.instagram.metrics = instagramMetrics.value;
  }

  if (twitterMetrics.status === "fulfilled" && twitterMetrics.value) {
    response.twitter.metrics = twitterMetrics.value;
  }

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}