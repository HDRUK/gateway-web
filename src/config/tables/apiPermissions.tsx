import { Control, FieldValues } from "react-hook-form";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import { capitalise } from "@/utils/general";

const columnHelper = createColumnHelper<{ name: string; label: string }>();

interface ColumnReadState {
    collections: boolean;
    tools: boolean;
    datasets: boolean;
    dur: boolean;
}

const getColumns = <T extends FieldValues>(
    control: Control<T>,
    columnReadDisabled: ColumnReadState
): ColumnDef<{ name: string; label: string }>[] => {
    return [
        columnHelper.display({
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Scope
                </Box>
            ),
            cell: ({ row: { original } }) => original.label,
        }),
        ...["create", "read", "update", "delete"].map(key =>
            columnHelper.display({
                id: key,
                header: () => (
                    <Box sx={{ p: 0 }} textAlign="left">
                        {capitalise(key)}
                    </Box>
                ),
                cell: ({ row: { original } }) => (
                    <Checkbox
                        size="large"
                        control={control}
                        name={`${original.name}.${key}`}
                        formControlSx={{ mb: 0 }}
                        disabled={
                            key === "read" &&
                            columnReadDisabled[
                                original.name as keyof typeof columnReadDisabled
                            ]
                        }
                    />
                ),
            })
        ),
    ];
};

export { getColumns };
