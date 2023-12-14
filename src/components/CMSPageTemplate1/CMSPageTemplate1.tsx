"use client";

import { PageTemplate1 } from "@/interfaces/Cms";
import HTMLContent from "@/components/HTMLContent";
import GradientBanner from "@/components/GradientBanner";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Link from "@/components/Link";

import "@/styles/wpStyles.css";

const CMSPageTemplate1 = ({ content }: { content: PageTemplate1 }) => {
    const {
        template: { template1Fields },
    } = content;

    return (
        <div className="wpStyles">
            <GradientBanner title={template1Fields.bannerTitle} />
            <Box sx={{ p: 0, bgcolor: "white", pb: 2 }}>
                <Box sx={{ display: { laptop: "flex" } }}>
                    <Box sx={{ flex: 1 }}>
                        <HTMLContent content={template1Fields.topLeftPanel} />
                        {template1Fields.ctaLink && (
                            <Link passHref href={template1Fields.ctaLink.url}>
                                <Button sx={{ mt: 3 }}>
                                    {template1Fields.ctaLink.title}
                                </Button>
                            </Link>
                        )}
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
                {template1Fields.ctaLink && (
                    <Link passHref href={template1Fields.ctaLink.url}>
                        <Button color="inherit">
                            {template1Fields.ctaLink.title}
                        </Button>
                    </Link>
                )}
            </Box>
        </div>
    );
};

export default CMSPageTemplate1;
