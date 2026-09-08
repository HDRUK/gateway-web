"use client";

import { useMemo, useState } from "react";
import { Button } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Integration } from "@/interfaces/Integration";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Link from "@/components/Link";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import IntegrationListItem from "../IntegrationListItem";

const TRANSLATION_PATH = `pages.account.team.integrations.integrations.list`;

const IntegrationList = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const [currentPage, setCurrentPage] = useState(1);

    const params = useParams<{ teamId: string }>();
    const { data, isLoading, mutate } = useGet<PaginationType<Integration>>(
        `${apis.teamsV1Url}/${params?.teamId}/federations?per_page=10&page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    useMemo(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const { lastPage, list, from } = data || {};

    const startIndex = from || 1;

    return (
        <BoxContainer sx={{ mt: 1 }}>
            {list?.map((integration, index) => (
                <IntegrationListItem
                    key={integration.id}
                    index={index + startIndex}
                    integration={integration}
                    onChanged={() => mutate()}
                />
            ))}
            {list?.length === 0 && (
                <Paper>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}>
                        <Typography>{t("empty")}</Typography>
                        <Link
                            passHref
                            href={`/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}/${RouteName.CREATE}`}>
                            <Button purpose="link">{t("emptyAction")}</Button>
                        </Link>
                    </Box>
                </Paper>
            )}
            <Pagination
                isLoading={isLoading}
                page={currentPage}
                count={lastPage}
                onChange={(e: React.ChangeEvent<unknown>, page: number) =>
                    setCurrentPage(page)
                }
            />
        </BoxContainer>
    );
};

export default IntegrationList;
