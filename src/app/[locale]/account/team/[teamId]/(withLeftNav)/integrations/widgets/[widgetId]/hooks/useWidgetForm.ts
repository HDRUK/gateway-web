"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Resolver, useForm, UseFormReturn } from "react-hook-form";
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
import { BRANDING_DEFAULTS, DATA_CUSTODIAN_LIMIT, TabValues } from "../const";

const TRANSLATION_PATH = `pages.account.team.widgets.edit`;

const ENTITY_TYPES = [
    {
        toggle: "has_datasets",
        field: "included_datasets",
        message: "includedDatasetsRequired",
    },
    {
        toggle: "has_datauses",
        field: "included_data_uses",
        message: "includedDataUsesRequired",
    },
    {
        toggle: "has_scripts",
        field: "included_scripts",
        message: "includedScriptsRequired",
    },
    {
        toggle: "has_collections",
        field: "included_collections",
        message: "includedCollectionsRequired",
    },
] as const;

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
            ...BRANDING_DEFAULTS,
            ...widget,
            has_datasets:
                templateType === CUSTODIAN || templateType === DATASETS
                    ? true
                    : !!widget?.included_datasets?.length,
            has_data_custodians: true,
            has_datauses:
                templateType === CUSTODIAN || templateType === DATA_USES
                    ? true
                    : !!widget?.included_data_uses?.length,
            has_scripts:
                templateType === CUSTODIAN
                    ? true
                    : !!widget?.included_scripts?.length,
            has_collections:
                templateType === CUSTODIAN
                    ? true
                    : !!widget?.included_collections?.length,
        }),
        [defaultCustodians, templateType, widget]
    );

    const form = useForm<Widget>({
        defaultValues: initialDefaults,
        resolver: yupResolver(
            yup
                .object({
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
                    ...Object.fromEntries(
                        ENTITY_TYPES.map(({ toggle, field, message }) => [
                            field,
                            yup.array().when(toggle, {
                                is: true,
                                then: schema => schema.min(1, t(message)),
                            }),
                        ])
                    ),
                })
                .test(
                    "at-least-one-entity-type",
                    t("entityTypeRequired"),
                    value =>
                        ENTITY_TYPES.some(
                            ({ toggle }) => (value as Partial<Widget>)[toggle]
                        )
                )
        ) as unknown as Resolver<Widget>,
    });

    useEffect(() => {
        form.reset(initialDefaults, { keepValues: true });
    }, [initialDefaults]);

    // "Keep proportions" links the size inputs: editing width updates height to
    // keep the ratio, and vice versa (e.g. 400x200, set width 500 -> height 250).
    const keepProportions = form.watch("keep_proportions");
    const width = Number(form.watch("size_width"));
    const height = Number(form.watch("size_height"));
    const prevSize = useRef({ width, height });

    useEffect(() => {
        const prev = prevSize.current;
        prevSize.current = { width, height };

        // Only adjust when locked, values are valid, and exactly one dimension
        // changed. Changing both at once (a size preset) just re-bases the ratio.
        if (!keepProportions || !width || !height || !prev.width || !prev.height)
            return;
        const widthChanged = width !== prev.width;
        if (widthChanged === (height !== prev.height)) return;

        if (widthChanged) {
            const newHeight = Math.round((prev.height * width) / prev.width);
            prevSize.current = { width, height: newHeight };
            if (newHeight !== height)
                form.setValue("size_height", newHeight, { shouldDirty: true });
        } else {
            const newWidth = Math.round((prev.width * height) / prev.height);
            prevSize.current = { width: newWidth, height };
            if (newWidth !== width)
                form.setValue("size_width", newWidth, { shouldDirty: true });
        }
    }, [keepProportions, width, height, form]);

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
