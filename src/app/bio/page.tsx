import { Meta, Schema } from "@once-ui-system/core";
import BioProfileHeader from "@/components/bio/BioProfileHeader";
import OpenBentoShowcaseGrid from "@/components/bio/OpenBentoShowcaseGrid";
import { baseURL, bioPage, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: bioPage.title,
    description: bioPage.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(bioPage.title)}`,
    path: bioPage.path,
  });
}

export default function Bio() {
  const profile = bioPage.profile;
  const origin = baseURL.replace(/\/$/, "");
  const shareUrl = `${origin}${bioPage.path}`;
  const displayUrl = shareUrl.replace(/^https?:\/\//, "");

  return (
    <div className="landing-page">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={bioPage.title}
        description={bioPage.description}
        path={bioPage.path}
        image={`/api/og/generate?title=${encodeURIComponent(bioPage.title)}`}
      />
      <div className="landing-section-inner bio-page-inner">
        {profile ? (
          <BioProfileHeader
            handle={profile.handle}
            tagline={profile.tagline}
            avatarSrc={person.avatar}
            shareUrl={shareUrl}
            displayUrl={displayUrl}
          />
        ) : null}
        <OpenBentoShowcaseGrid
          linkedinUrl={profile?.linkedinUrl ?? "https://www.linkedin.com/in/harxhist"}
          contactEmail={profile?.contactEmail ?? person.email}
          contactLabel={profile?.contactLabel ?? "Contact Me"}
        />
      </div>
    </div>
  );
}
