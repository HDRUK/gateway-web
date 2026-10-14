"use client";

import { Banner } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import { HomepageBannerNode } from "@/interfaces/Homepage";

const TRANSLATION_PATH = "components.CMSBanner";

const CMSBanners = ({ data }: { data: HomepageBannerNode[] }) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <div>
            {data.map(
                ({
                    node: {
                        homepageBanner: {
                            description,
                            heading,
                            linkText,
                            linkUrl,
                        },
                    },
                }) => {
                    return !!description || !!heading ? (
                        <Banner
                            key={`${heading}${description}`}
                            highlight={heading}
                            actionLabel={
                                linkText && linkUrl ? linkText : undefined
                            }
                            slotProps={{ action: { href: linkUrl } }}
                            closable
                            closeLabel={t("ariaCloseButtonLabel")}>
                            {description}
                        </Banner>
                    ) : null;
                }
            )}
        </div>
    );
};

export default CMSBanners;
