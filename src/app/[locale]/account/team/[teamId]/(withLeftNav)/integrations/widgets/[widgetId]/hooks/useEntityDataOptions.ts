"use client";

import { useCallback, useMemo } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Widget, WidgetResponse } from "@/interfaces/Widget";

type Entity = {
    id: number | string;
    team_id?: number | string;
    team_name?: string;
    [key: string]: any;
};

export function useEntityOptions(
    entityData: WidgetResponse | undefined,
    setValue: UseFormSetValue<Widget>
) {
    const formatEntityOptions = useCallback(
        (
            entityType: keyof WidgetResponse,
            valueKey: string,
            labelKey: string
        ) =>
            (entityData?.[entityType] as Entity[])?.map(entity => ({
                value: entity?.[valueKey]?.toString(),
                label: entity?.[labelKey],
                team: entity?.team_name,
                teamId: entity?.team_id,
            })) ?? [],
        [entityData]
    );

    const selectAllOptions = useMemo(
        () => (formValue: keyof Widget, entityType: keyof WidgetResponse) => {
            const allValues = Array.isArray(entityData?.[entityType])
                ? (entityData?.[entityType] as Entity[]).map(d =>
                      d.id.toString()
                  )
                : [];
            setValue(formValue, allValues, { shouldDirty: true });
        },
        [entityData, setValue]
    );

    return { formatEntityOptions, selectAllOptions };
}
