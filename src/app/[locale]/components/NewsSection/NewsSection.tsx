"use client";

import { useTranslations } from "next-intl";
import { CMSPostsResponse } from "@/interfaces/Cms";
import { EventNode } from "@/interfaces/Events";
import { NewsNode } from "@/interfaces/News";
import Box from "@/components/Box";
import NewsSummaryCard from "@/components/NewsSummaryCard";

const NewsSection = ({ posts }: CMSPostsResponse<NewsNode | EventNode>) => {
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
                }) => ({
                    /* <NewsSummaryCard
                        variant="feature"
                        buttonText={t("newsCardButtonText")}
                        summary={text}
                        imageLink={image?.node?.mediaItemUrl}
                        imageAlt={image?.node?.altText}
                        imageHeight="140px"
                        headline={headline}
                        date={date}
                        url={link.url}
                        key={`${date}-${link}`}
                /> */
                })
            )}
        </Box>
    );
};

export default NewsSection;
