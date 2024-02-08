import { ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import { User } from "@/interfaces/User";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import Tooltip from "@/components/Tooltip";

interface TableActionCellProps {
    user: User;
    actions: {
        label?: string;
        checkConditions?: (user: User) => { title: string; disabled: boolean };
        icon: IconType;
        onClick: (user: User) => void;
    }[];
}

const linkWrapper = (title: string) => (children: ReactNode) => {
    return (
        <Tooltip title={title}>
            <span>{children}</span>
        </Tooltip>
    );
};
const TableActionCell = ({ actions, user }: TableActionCellProps) => {
    if (actions.length === 1) {
        const [{ onClick, icon: Icon, checkConditions, ...rest }] = actions;

        const { title, disabled } =
            typeof checkConditions === "function"
                ? checkConditions(user)
                : { title: "", disabled: false };

        return (
            <Box display="flex" alignItems="center" justifyContent="center">
                <ConditionalWrapper
                    requiresWrapper={!!title}
                    wrapper={linkWrapper(title || "")}
                >
                    <IconButton
                        color="primary"
                        onClick={() => onClick(user)}
                        disabled={disabled}
                        {...rest}
                    >
                        <Icon />
                    </IconButton>
                </ConditionalWrapper>
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
