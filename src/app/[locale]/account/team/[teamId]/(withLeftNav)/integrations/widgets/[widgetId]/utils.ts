import { ValueType } from "@/components/Autocomplete/Autocomplete";

export const filterSelectedByTeam = <T>(
    selectedIds: number[] | undefined,
    items: T[] | undefined,
    getId: (item: T) => number,
    getTeamId: (item: T) => number | undefined,
    allowedTeams: Set<string>
): number[] => {
    if (!Array.isArray(selectedIds) || !selectedIds.length || !items?.length) {
        return selectedIds ?? [];
    }

    return selectedIds.filter(selId => {
        const match = items.find(it => String(getId(it)) === String(selId));
        if (!match) return false;
        const team = getTeamId(match);
        return team != null && allowedTeams.has(String(team));
    });
};

export const getChipLabel = (
    options: { value: string | number; label: string }[],
    value: ValueType
) => options.find(option => option.value.toString() === value)?.label;

export const isOptionEqualToValue = (
    option: { value: string | number; label: string },
    value: string | number
) => option.value === value;
