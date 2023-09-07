import { Box, IconButton } from "@mui/material";
import { ReactNode } from "react";

interface TableActionCellProps {
    actions: { label?: string; icon: ReactNode; onClick: () => void }[];
}

const TableActionCell = ({ actions }: TableActionCellProps) => {
    if (actions.length === 1) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center">
                <IconButton onClick={actions[0].onClick}>
                    {actions[0].icon}
                </IconButton>
            </Box>
        );
    }

    // Todo implement a Popover Menu component if there's more than one action GAT-2924

    return (
        <Box>
            {actions.map(action => (
                <div>{action.label}</div>
            ))}
        </Box>
    );
};

export default TableActionCell;
