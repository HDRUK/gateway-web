import { IconButton, Tooltip } from "@mui/material";
import { IconType } from "@/interfaces/Ui";

interface CardAction {
    icon: IconType;
    href?: string;
    action?: (id: number) => void;
    disabled?: boolean;
    label: string;
    query?: Record<string, string>;
}

interface CardActionsProps {
    id: number;
    query?: Record<string, string>;
    actions: CardAction[];
}

const CardActions = ({ actions, id, query }: CardActionsProps) => {
    return actions.map(
        ({ icon: Icon, href, label, disabled, action, query: actionQuery }) => {
            const params = new URLSearchParams({
                ...query,
                ...actionQuery,
            }).toString();

            return (
                <Tooltip key={label} placement="left" title={label}>
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
                        <Icon color={disabled ? "disabled" : "primary"} />
                    </IconButton>
                </Tooltip>
            );
        }
    );
};

export default CardActions;
export type { CardAction };
