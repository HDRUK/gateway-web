"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CMSPostResponse, NewsPost } from "@/interfaces/Cms";
import Box from "@/components/Box";
import NewsSummaryCard from "@/components/NewsSummaryCard";

const NewsSection = ({ posts }: CMSPostResponse<NewsPost>) => {
    const t = useTranslations("pages.home");
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(2, 1fr)",
                    desktop: "repeat(4, 1fr)",
                },
                gap: {
                    mobile: 4,
                },
                justifyItems: "center",
            }}>
            {posts.edges.map(
                ({
                    node: {
                        newsFields: { text, headline, date, image, link },
                    },
                }) => (
                    <NewsSummaryCard
                        buttonText={t("newsCardButtonText")}
                        summary={text}
                        imageLink={image.node.mediaItemUrl}
                        imageAlt={image.node.altText}
                        headline={headline}
                        date={date}
                        url={link.url}
                    />
                )
            )}
        </Box>
    );
};

export default NewsSection;
