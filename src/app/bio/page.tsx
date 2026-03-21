import { Meta, Schema } from "@once-ui-system/core";
import { baseURL, bioPage } from "@/resources";
import OpenBentoShowcaseGrid from "@/components/bio/OpenBentoShowcaseGrid";

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
      <div className="landing-section-inner">
        {/* <h2 className="landing-section-title">Your content, beautifully organized</h2>
        <p className="landing-section-subtitle">
          Mix and match widgets to create the perfect page. Social links, maps, music, code, text
          - all in one place.
        </p> */}
        <OpenBentoShowcaseGrid />
      </div>
    </div>
  );
}
