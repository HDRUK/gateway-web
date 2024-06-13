"use client";

import { ReactElement } from "react";
import { PageTemplatePromo } from "@/interfaces/Cms";
import Box from "@/components/Box";
import Button from "@/components/Button";
import GradientBanner from "@/components/GradientBanner";
import HTMLContent from "@/components/HTMLContent";
import Link from "@/components/Link";
import "@/styles/wpStyles.css";

const CMSPromoTemplate = ({
    content,
    ctaOverrideComponent,
}: {
    content: PageTemplatePromo;
    ctaOverrideComponent?: ReactElement;
}) => {
    const {
        template: { promofields },
    } = content;

    const CtaContent =
        ctaOverrideComponent ||
        (promofields.ctaLink && (
            <Link passHref href={promofields.ctaLink.url}>
                <Button sx={{ mt: 3 }}>{promofields.ctaLink.title}</Button>
            </Link>
        ));

    return (
        <div className="wpStyles">
            <GradientBanner title={promofields.bannerTitle} />
            <Box sx={{ p: 0, bgcolor: "white", pb: 2 }}>
                <Box sx={{ display: { laptop: "flex" } }}>
                    <Box sx={{ flex: 1 }}>
                        <HTMLContent content={promofields.topLeftPanel} />
                        {CtaContent}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {promofields.topRightPanel && (
                            <HTMLContent content={promofields.topRightPanel} />
                        )}
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pb: 10,
                }}>
                <Box
                    sx={{
                        maxWidth: "1100px",
                    }}>
                    <HTMLContent content={promofields.middlePanel} />
                </Box>
                {CtaContent}
            </Box>
        </div>
    );
};

export default CMSPromoTemplate;
