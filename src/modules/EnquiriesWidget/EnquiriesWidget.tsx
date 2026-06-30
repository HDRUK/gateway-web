"use client";

import { useTranslations } from "next-intl";
import { DashboardEntityCount } from "@/interfaces/Dashboard";
import CountTilesWidget from "@/components/CountTilesWidget/CountTilesWidget";
import useGet from "@/hooks/useGet";
import useGetTeam from "@/hooks/useGetTeam";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.account.dashboard.enquiries";

interface EnquiriesWidgetProps {
    teamId: string;
    startDate: string;
    endDate: string;
}

const EnquiriesWidget = ({
    teamId,
    startDate,
    endDate,
}: EnquiriesWidgetProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { team } = useGetTeam(teamId);
    const isDarEnabled = team?.is_question_bank ?? false;

    const params = new URLSearchParams({ startDate, endDate }).toString();
    const dashboardUrl = `${apis.teamsV3Url}/${teamId}/dashboard`;

    const { data: generalEnquiries, isLoading: generalLoading } =
        useGet<DashboardEntityCount>(
            `${dashboardUrl}/general-enquires/count?${params}`,
            {}
        );
    const { data: feasibilityEnquiries, isLoading: feasibilityLoading } =
        useGet<DashboardEntityCount>(
            `${dashboardUrl}/fesability-enquires/count?${params}`,
            {}
        );
    const { data: dataAccessRequests, isLoading: darLoading } =
        useGet<DashboardEntityCount>(
            isDarEnabled
                ? `${dashboardUrl}/data-access-requests/count?${params}`
                : null,
            {}
        );

    const isLoading =
        generalLoading || feasibilityLoading || (isDarEnabled && darLoading);

    const items = [
        {
            key: "generalEnquiries",
            label: t("labels.generalEnquiries"),
            count: generalEnquiries?.total_by_interval,
        },
        {
            key: "feasibilityEnquiries",
            label: t("labels.feasibilityEnquiries"),
            count: feasibilityEnquiries?.total_by_interval,
        },
        ...(isDarEnabled
            ? [
                  {
                      key: "dataAccessRequests",
                      label: t("labels.dataAccessRequests"),
                      count: dataAccessRequests?.total_by_interval,
                  },
              ]
            : []),
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

export default EnquiriesWidget;
