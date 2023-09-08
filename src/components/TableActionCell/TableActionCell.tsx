import { User } from "@/interfaces/User";
import { Box, IconButton } from "@mui/material";
import { ReactNode } from "react";

interface TableActionCellProps {
    user: User;
    actions: { label?: string; icon: ReactNode; onClick: () => void }[];
}

const TableActionCell = ({ actions, user }: TableActionCellProps) => {
    if (actions.length === 1) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center">
                <IconButton onClick={() => actions[0].onClick(user)}>
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
