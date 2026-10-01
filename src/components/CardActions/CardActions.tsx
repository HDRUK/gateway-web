import { IconButton, SxProps, Tooltip } from "@mui/material";
import { IconType } from "@/interfaces/Ui";

interface CardAction {
    icon: IconType;
    iconSx?: SxProps;
    href?: string;
    action?: (id: number) => void;
    disabled?: boolean;
    label: string;
    tooltip?: string;
    query?: Record<string, string>;
}

interface CardActionsProps {
    id: number;
    query?: Record<string, string>;
    actions: CardAction[];
}

const CardActions = ({ actions, id, query }: CardActionsProps) => {
    return actions.map(
        ({
            icon: Icon,
            iconSx,
            href,
            label,
            tooltip,
            disabled,
            action,
            query: actionQuery,
        }) => {
            const params = new URLSearchParams({
                ...query,
                ...actionQuery,
            }).toString();

            return (
                <Tooltip key={label} placement="left" title={tooltip ?? label}>
                    {/* Tooltip's hover listener needs a non-disabled element to
                        attach to - a disabled <button> fires no mouse events. */}
                    <span>
                        <IconButton
                            {...(action &&
                                !disabled && {
                                    onClick: () => {
                                        action(id);
                                    },
                                })}
                            disableRipple
                            size="large"
                            disabled={disabled}
                            aria-label={label}
                            {...(href &&
                                !disabled && {
                                    href: `${href}/${id}${
                                        params ? `?${params}` : ""
                                    }`,
                                })}>
                            <Icon
                                color={disabled ? "disabled" : "primary"}
                                sx={iconSx}
                            />
                        </IconButton>
                    </span>
                </Tooltip>
            );
        }
    );
};

export default CardActions;
export type { CardAction };
