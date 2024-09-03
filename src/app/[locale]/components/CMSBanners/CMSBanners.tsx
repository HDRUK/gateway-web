"use client";

import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import InfoBanner from "@/components/InfoBanner";
import { getHomePageBanner } from "@/utils/cms";

const TRANSLATION_PATH = "components.CMSBanner";

const CMSBanners = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const [data, setData] = useState<HomepageBannerNode[]>([]);

    useEffect(() => {
        process.env.NEXT_PUBLIC_INCLUDE_BANNERS &&
            getHomePageBanner().then(response => {
                setData(response);
            });
    }, []);

    return data?.length ? (
        <div>
            {data.map(
                (
                    {
                        node: {
                            homepageBanner: {
                                description,
                                heading,
                                linkText,
                                linkUrl,
                            },
                        },
                    },
                    i: number
                ) => {
                    return !!description || !!heading ? (
                        <InfoBanner
                            ariaCloseButtonLabel={t("ariaCloseButtonLabel")}
                            isDismissable
                            action={
                                <>
                                    {linkText && linkUrl && (
                                        <Button
                                            color="greyCustom"
                                            variant="contained"
                                            href={linkUrl}>
                                            {linkText}
                                        </Button>
                                    )}
                                </>
                            }
                            message={
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        width: "100%",
                                    }}>
                                    <Typography
                                        variant="h3"
                                        sx={{ mb: 0, color: "warning" }}>
                                        {heading}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexGrow: 1,
                                        }}>
                                        <Typography sx={{ flexGrow: 1 }}>
                                            {description}
                                        </Typography>
                                    </Box>
                                </Box>
                            }
                        />
                    ) : null;
                }
            )}
        </div>
    ) : null;
};

export default CMSBanners;
