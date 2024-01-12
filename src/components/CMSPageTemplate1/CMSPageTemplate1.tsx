"use client";

import { ReactElement } from "react";
import { PageTemplate1 } from "@/interfaces/Cms";
import Box from "@/components/Box";
import Button from "@/components/Button";
import GradientBanner from "@/components/GradientBanner";
import HTMLContent from "@/components/HTMLContent";
import Link from "@/components/Link";
import "@/styles/wpStyles.css";

const CMSPageTemplate1 = ({
    content,
    ctaOverrideComponent,
}: {
    content: PageTemplate1;
    ctaOverrideComponent?: ReactElement;
}) => {
    const {
        template: { template1Fields },
    } = content;

    const CtaContent =
        ctaOverrideComponent ||
        (template1Fields.ctaLink && (
            <Link passHref href={template1Fields.ctaLink.url}>
                <Button sx={{ mt: 3 }}>{template1Fields.ctaLink.title}</Button>
            </Link>
        ));

    return (
        <div className="wpStyles">
            <GradientBanner title={template1Fields.bannerTitle} />
            <Box sx={{ p: 0, bgcolor: "white", pb: 2 }}>
                <Box sx={{ display: { laptop: "flex" } }}>
                    <Box sx={{ flex: 1 }}>
                        <HTMLContent content={template1Fields.topLeftPanel} />
                        {CtaContent}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {template1Fields.topRightPanel && (
                            <HTMLContent
                                content={template1Fields.topRightPanel}
                            />
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
                    <HTMLContent content={template1Fields.middlePanel} />
                </Box>
                {CtaContent}
            </Box>
        </div>
    );
};

export default CMSPageTemplate1;
