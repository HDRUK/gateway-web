import { get } from "lodash";
import Script from "next/script";
import { VersionItem } from "@/interfaces/Dataset";

interface GoogleRecommendedProps {
    metadata: VersionItem;
}

const METADATA_PATH = "metadata.metadata";

const GoogleRecommended = ({ metadata }: GoogleRecommendedProps) => {
    const linkedDataJson = get(metadata, METADATA_PATH);

    return (
        <Script type="application/ld+json" strategy="lazyOnload" id="ld-json">
            {JSON.stringify(linkedDataJson)}
        </Script>
    );
};

export default GoogleRecommended;
