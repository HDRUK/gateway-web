"use client";

import Script from "next/script";

export const HDRGlobals = ({
    version,
    features,
}: {
    version: string;
    features: object;
}) => {
    return (
        <Script id="hdr-globals" strategy="afterInteractive">
            {`
        window.HDRGlobals = {
          features: ${JSON.stringify(features)},
          version: ${JSON.stringify(version)}
        };
      `}
        </Script>
    );
};
