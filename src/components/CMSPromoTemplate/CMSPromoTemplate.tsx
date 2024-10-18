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
            <Box
                sx={{
                    bgcolor: "white",
                    pt: 5,
                    pb: 8,
                    px: 6,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                }}>
                <Box
                    sx={{
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ flex: 1 }}>
                        <HTMLContent content={promofields.topLeftPanel} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {promofields.topRightPanel && (
                            <HTMLContent content={promofields.topRightPanel} />
                        )}
                    </Box>
                </Box>
                {CtaContent}
            </Box>
            <Box
                sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 5,
                    pb: 8,
                    px: 6,
                }}>
                <Box>
                    <HTMLContent content={promofields.middlePanel} />
                </Box>
                {CtaContent}
            </Box>
            {promofields.bottomPanel && (
                <Box
                    sx={{
                        display: "flex",
                        bgcolor: "white",
                        alignItems: "center",
                        flexDirection: "column",
                        pt: 5,
                        pb: 8,
                        px: 6,
                    }}>
                    <Box sx={{ display: { laptop: "flex" } }}>
                        <Box sx={{ flex: 1 }}>
                            <HTMLContent content={promofields.bottomPanel} />
                        </Box>
                    </Box>
                    {CtaContent}
                </Box>
            )}
        </div>
    );
};

export default CMSPromoTemplate;
