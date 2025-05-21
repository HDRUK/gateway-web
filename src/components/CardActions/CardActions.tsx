import { IconButton, Tooltip } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import { DataStatus } from "@/consts/application";

interface CardActionsProps {
    id: number;
    status?: string;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        disabled?: boolean;
        label: string;
    }[];
}

const CardActions = ({ actions, id, status }: CardActionsProps) => {
    return actions.map(({ icon: Icon, href, label, disabled, action }) => {
        const searchParams = new URLSearchParams();

        if (href) {
            if (status === DataStatus.DRAFT) {
                searchParams.set("status", status);
            }

            if (label.toLowerCase().includes("duplicate")) {
                searchParams.set("duplicate", "true");
            }
        }

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
                                searchParams.size ? `?${searchParams}` : ""
                            }`,
                        })}>
                    <Icon color={disabled ? "disabled" : "primary"} />
                </IconButton>
            </Tooltip>
        );
    });
};

export default CardActions;
