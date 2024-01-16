import { Control, FieldValues } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
import { Team } from "@/interfaces/Team";
import Box from "@/components/Box";
import Checkbox from "@/components/Checkbox";
import { capitalise } from "@/utils/general";

const getColumns = (
    permissions: { [key: string]: boolean },
    actions: {
        label?: string;
        onClick: (rowUser: User) => void;
        icon: ReactNode;
    }[]
): ColumnDef<Team>[] => {
    return [
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Updated
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Data custodian
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Team manager(s)
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Question Bank Enabled?
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
        {
            id: "label",
            header: () => (
                <Box sx={{ p: 0 }} textAlign="left">
                    Actions
                </Box>
            ),
            accessorFn: row => `${row.label}`,
        },
    ];
};

export { getColumns };
