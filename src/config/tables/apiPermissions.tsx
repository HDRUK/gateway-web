import { Control, FieldValues } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import { capitalise } from "@/utils/general";

const getColumns = <T extends FieldValues>(
    control: Control<T>
): ColumnDef<{ name: string; label: string }>[] => {
    return [
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Scope
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
        ...["create", "read", "update", "delete"].map(key => ({
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
        })),
    ];
};

export { getColumns };
