import { Control, FieldValues } from "react-hook-form";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import { capitalise } from "@/utils/general";

const columnHelper = createColumnHelper<{ name: string; label: string }>();

const getColumns = <T extends FieldValues>(
    control: Control<T>
): ColumnDef<{ name: string; label: string }>[] => {
    return [
        columnHelper.display({
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Scope
                </Box>
            ),
            cell: ({ row: { original } }) => `${original.label}`,
        }),
        ...["create", "read", "update", "delete"].map(key =>
            columnHelper.display({
                id: key,
                header: () => (
                    <Box sx={{ p: 0 }} textAlign="left">
                        {capitalise(key)}
                    </Box>
                ),
                cell: ({ row: { original } }) => {
                    return (
                        <Checkbox
                            size="large"
                            control={control}
                            name={`${original.name}.${key}`}
                            formControlSx={{ mb: 0 }}
                        />
                    );
                },
            })
        ),
    ];
};

export { getColumns };
