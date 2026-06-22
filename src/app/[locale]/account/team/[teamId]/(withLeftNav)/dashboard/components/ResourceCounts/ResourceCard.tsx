"use client";

import { useTranslations } from "next-intl";
import { DashboardEntity, DashboardEntityCount } from "@/interfaces/Dashboard";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { ResourceCardItem } from "./ResourceCounts.styles";

const TRANSLATION_PATH = "pages.account.dashboard.resources";

interface ResourceCardProps {
    teamId: string;
    label: string;
    entity: DashboardEntity | null;
    startDate?: string;
    endDate?: string;
    fallbackData?: DashboardEntityCount;
}

const ResourceCard = ({
    teamId,
    label,
    entity,
    startDate,
    endDate,
    fallbackData,
}: ResourceCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const query = params.toString() ? `?${params.toString()}` : "";

    const { data } = useGet<DashboardEntityCount>(
        entity
            ? `${apis.teamsV3Url}/${teamId}/dashboard/${entity}/count${query}`
            : null,
        { keepPreviousData: true, fallbackData, errorNotificationsOn: false }
    );

    return (
        <ResourceCardItem data-testid={`resource-card-${entity ?? label}`}>
            <Typography variant="h1" component="div" sx={{ mb: 0 }}>
                {entity && data ? data.total : "—"}
            </Typography>
            <Typography>{label}</Typography>
            {entity && !!data?.total_by_interval && (
                <Chip
                    size="small"
                    label={t("addedThisPeriod", {
                        count: data.total_by_interval,
                    })}
                    sx={{ bgcolor: "success.main", color: "common.white" }}
                />
            )}
        </ResourceCardItem>
    );
};

export default ResourceCard;
