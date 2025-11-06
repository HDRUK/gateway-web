"use client";

import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { Widget, WidgetResponse } from "@/interfaces/Widget";
import { filterSelectedByTeam } from "../utils";

export default function useFilterByCustodian(
    form: UseFormReturn<Widget>,
    entityData: WidgetResponse | undefined
) {
    const custodians = form.watch("data_custodian_entities_ids");
    const allowedTeams = useMemo(
        () => new Set((custodians ?? []).map(String)),
        [custodians]
    );

    useEffect(() => {
        if (!entityData) return;

        const apply = <T extends { id: number; team_id?: number }>(
            field: keyof Widget,
            list: T[] | undefined
        ) => {
            const selected = form.watch(field) as number[] | undefined;
            if (!Array.isArray(selected) || !list) return;

            const filtered = filterSelectedByTeam(
                selected,
                list,
                item => item.id,
                item => item.team_id,
                allowedTeams
            );

            if ((filtered?.length ?? 0) !== (selected?.length ?? 0)) {
                form.setValue(field as keyof Widget, filtered, {
                    shouldDirty: true,
                });
            }
        };

        apply("included_datasets", entityData.datasets);
        apply("included_data_uses", entityData.durs);
        apply("included_scripts", entityData.tools);
        apply("included_collections", entityData.collections);
    }, [entityData, allowedTeams]);
}
