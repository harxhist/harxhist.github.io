import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const skullPath = path.join(process.cwd(), "public/images/skull.jpg");
  const skullBuffer = await readFile(skullPath);
  const skullSrc = `data:image/jpeg;base64,${skullBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={skullSrc}
          alt=""
          width={28}
          height={28}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
