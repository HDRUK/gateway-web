"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TeamNames } from "@/interfaces/Team";
import { Widget, WidgetResponse } from "@/interfaces/Widget";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { TabValues } from "../../const";
import { useEntityOptions } from "../../hooks/useEntityDataOptions";
import useFilterByCustodian from "../../hooks/useFilterByCustodian";
import useWidgetForm from "../../hooks/useWidgetForm";
import WidgetConfigForm from "../WidgetConfigForm";
import WidgetPreview from "../WidgetPreview";

interface WidgetCreatorProps {
    widget?: Widget;
    teamId: string;
    teamNames: TeamNames[];
}

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

const WidgetCreator = ({ widget, teamId, teamNames }: WidgetCreatorProps) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations(TRANSLATION_PATH);

    const templateType = searchParams.get("template");

    const { form, widgetId, onSubmit } = useWidgetForm(
        teamId,
        teamNames,
        widget,
        templateType
    );

    const teamNameOptions = useMemo(
        () =>
            teamNames.map(team => ({
                value: team.id.toString(),
                label: team.name,
            })),
        [teamNames]
    );

    const changeTab = (targetTab: TabValues) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", targetTab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const custodians = form.watch("data_custodian_entities_ids") || [];
    const teamIdsParam = Array.isArray(custodians) ? custodians.join(",") : "";

    const { data: entityData } = useGet<WidgetResponse>(
        teamIdsParam
            ? `${apis.teamsV1Url}/${teamId}/widgets/data?team_ids=${teamIdsParam}`
            : null,
        { shouldFetch: !!teamIdsParam, keepPreviousData: true }
    );

    const { formatEntityOptions, selectAllOptions } = useEntityOptions(
        entityData,
        form.setValue
    );

    useFilterByCustodian(form, entityData);

    const handleSubmitAndPreview = async (
        values: Widget,
        dirtyFields: Partial<Record<keyof Widget, boolean>>
    ) => {
        await onSubmit(values, dirtyFields);
        if (widgetId) {
            changeTab(TabValues.PREVIEW);
        }
    };

    return (
        <Tabs
            centered
            tabBoxSx={{ background: "white", mb: 0 }}
            rootBoxSx={{ p: 0, mt: 3 }}
            tabs={[
                {
                    value: TabValues.CONFIGURATION,
                    label: t("configuration"),
                    content: (
                        <WidgetConfigForm
                            form={form}
                            onSubmit={handleSubmitAndPreview}
                            formatEntityOptions={formatEntityOptions}
                            selectAllOptions={selectAllOptions}
                            teamNameOptions={teamNameOptions}
                            teamId={teamId}
                        />
                    ),
                },
                {
                    value: TabValues.PREVIEW,
                    label: t("preview"),
                    disabled: !widgetId,
                    content: (
                        <WidgetPreview
                            widgetId={widgetId}
                            teamId={teamId}
                            widgetDomains={form.getValues("permitted_domains")}
                        />
                    ),
                },
            ]}
        />
    );
};

export default WidgetCreator;
