"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { TeamNames } from "@/interfaces/Team";
import { Unit, Widget } from "@/interfaces/Widget";
import usePatch from "@/hooks/usePatch";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import { CUSTODIAN, DATA_USES, DATASETS } from "@/consts/translation";
import { DATA_CUSTODIAN_LIMIT, TabValues } from "../const";

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

export default function useWidgetForm(
    teamId: string,
    teamNames: TeamNames[],
    widget?: Widget,
    templateType?: string | null
): {
    form: UseFormReturn<Widget>;
    widgetId?: number;
    onSubmit: (
        values: Widget,
        dirtyFields: Partial<Record<keyof Widget, boolean>>
    ) => Promise<void>;
    setWidgetId: React.Dispatch<React.SetStateAction<number | undefined>>;
} {
    const t = useTranslations(TRANSLATION_PATH);
    const { push } = useRouter();

    const teamNameOptions = useMemo(
        () => teamNames.map(t => ({ value: t.id.toString(), label: t.name })),
        [teamNames]
    );

    const defaultCustodians = useMemo(() => {
        const match = teamNameOptions.find(t => t.value === teamId);
        return match ? [match.value] : [];
    }, [teamNameOptions, teamId]);

    const initialDefaults = useMemo<Partial<Widget>>(
        () => ({
            data_custodian_entities_ids: defaultCustodians,
            included_datasets: [],
            included_data_uses: [],
            included_scripts: [],
            included_collections: [],
            permitted_domains: [],
            keep_proportions: false,
            include_search_bar:
                templateType === DATASETS || templateType === DATA_USES,
            include_cohort_link: false,
            size_width: 600,
            size_height: 740,
            unit: Unit.PX,
            widget_name: "",
            ...widget,
            has_datasets:
                templateType === CUSTODIAN || templateType === DATASETS
                    ? true
                    : widget?.included_datasets?.length,
            has_data_custodians: true,
            has_datauses:
                templateType === CUSTODIAN || templateType === DATA_USES
                    ? true
                    : widget?.included_data_uses?.length,
            has_scripts:
                templateType === CUSTODIAN
                    ? true
                    : widget?.included_scripts?.length,
            has_collections:
                templateType === CUSTODIAN
                    ? true
                    : widget?.included_collections?.length,
        }),
        [defaultCustodians, templateType, widget]
    );

    const form = useForm({
        defaultValues: initialDefaults,
        resolver: yupResolver(
            yup.object({
                data_custodian_entities_ids: yup
                    .array()
                    .of(yup.string())
                    .label(t("dataCustodians"))
                    .min(
                        1,
                        ({ label, path }) =>
                            `${label || path} must have at least 1 item`
                    )
                    .max(DATA_CUSTODIAN_LIMIT),
                permitted_domains: yup
                    .array()
                    .of(yup.string().url(t("validUrl")))
                    .label(t("permittedDomains"))
                    .min(
                        1,
                        ({ label, path }) =>
                            `${label || path} must have at least 1 item`
                    ),
                widget_name: yup.string().required().label(t("widgetName")),
            })
        ),
    });

    useEffect(() => {
        form.reset(initialDefaults, { keepValues: true });
    }, [initialDefaults]);

    const createWidget = usePost<Widget>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );
    const updateWidget = usePatch<Partial<Widget>>(
        `${apis.teamsV1Url}/${teamId}/widgets`,
        {
            itemName: t("widget"),
        }
    );

    const [widgetId, setWidgetId] = useState(widget?.id);

    const cleanPayload = (
        payload: Partial<Widget> & {
            has_datasets?: boolean;
            has_datauses?: boolean;
            has_scripts?: boolean;
            has_collections?: boolean;
        }
    ) => {
        const p = { ...payload };

        if (p.has_datasets === false) p.included_datasets = [];
        if (p.has_datauses === false) p.included_data_uses = [];
        if (p.has_scripts === false) p.included_scripts = [];
        if (p.has_collections === false) p.included_collections = [];

        delete p.has_datasets;
        delete p.has_datauses;
        delete p.has_scripts;
        delete p.has_collections;

        return p;
    };

    const onSubmit = async (
        values: Widget,
        dirtyFields: Partial<Record<keyof Widget, boolean>>
    ) => {
        if (!widget && !widgetId) {
            const res = await createWidget(cleanPayload(values) as Widget);
            push(
                `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}/${res}?tab=${TabValues.PREVIEW}`
            );
        } else if (widgetId) {
            const payload = Object.fromEntries(
                Object.entries(dirtyFields).map(([k]) => [
                    k,
                    values[k as keyof Widget],
                ])
            );
            await updateWidget(widgetId, cleanPayload(payload));
        }
    };

    return { form, widgetId, onSubmit, setWidgetId };
}
