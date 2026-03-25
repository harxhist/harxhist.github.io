"use client";

import { useCallback, useState } from "react";

type BioProfileHeaderProps = {
  handle: string;
  tagline: string;
  avatarSrc: string;
  shareUrl: string;
  /** Shown in the button, e.g. `harxhist.github.io/bio` */
  displayUrl: string;
};

export default function BioProfileHeader({
  handle,
  tagline,
  avatarSrc,
  shareUrl,
  displayUrl,
}: BioProfileHeaderProps) {
 

  return (
    <section className="bio-profile" aria-label="Profile">

      <div className="bio-profile-identity">
        <img
          className="bio-profile-avatar"
          src={avatarSrc}
          alt={handle}
          width={160}
          height={160}
          loading="eager"
        />
        <h1 className="bio-profile-handle">{handle}</h1>
      </div>
    </section>
  );
}
