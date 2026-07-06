"use client";

import { useTranslations } from "next-intl";
import CountTilesWidget from "@/components/CountTilesWidget/CountTilesWidget";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.account.dashboard.otherViews";

interface ViewCount {
    counter: number;
}

interface OtherViewsWidgetProps {
    teamId: string;
    startDate: string;
    endDate: string;
}

const OtherViewsWidget = ({
    teamId,
    startDate,
    endDate,
}: OtherViewsWidgetProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const params = new URLSearchParams({ startDate, endDate }).toString();
    const dashboardUrl = `${apis.teamsV3Url}/${teamId}/dashboard`;

    const { data: collectionsViews, isLoading: collectionsLoading } =
        useGet<ViewCount[]>(`${dashboardUrl}/collections/views?${params}`, {});
    const { data: dataCustodianViews, isLoading: dataCustodianLoading } =
        useGet<ViewCount[]>(`${dashboardUrl}/datacustodians/views?${params}`, {});

    const isLoading = collectionsLoading || dataCustodianLoading;

    const items = [
        {
            key: "collections",
            label: t("labels.collections"),
            count: collectionsViews?.[0]?.counter,
        },
        {
            key: "dataCustodian",
            label: t("labels.dataCustodian"),
            count: dataCustodianViews?.[0]?.counter,
        },
    ];

    return (
        <CountTilesWidget
            title={t("title")}
            loadingLabel={t("loading")}
            isLoading={isLoading}
            items={items}
        />
    );
};

export default OtherViewsWidget;
