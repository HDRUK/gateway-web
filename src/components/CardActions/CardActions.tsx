import { ReactNode } from "react";
import { IconButton } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import Link from "@/components/Link";
import Tooltip from "@/components/Tooltip";
import ConditionalWrapper from "../ConditionalWrapper";

interface CardActionsProps {
    id: number;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
        disabled?: boolean;
    }[];
}

const linkWrapper =
    ({ href, id }: { href?: string; id: number }) =>
    (children: ReactNode) => {
        return <Link href={`${href}/${id}`}>{children}</Link>;
    };

const CardActions = ({ actions, id }: CardActionsProps) => {
    return (
        <>
            {actions.map(({ icon: Icon, href, label, disabled, action }) => (
                <Tooltip key={label} placement="left" title={label}>
                    <ConditionalWrapper
                        requiresWrapper={!!href && !disabled}
                        wrapper={linkWrapper({
                            href,
                            id,
                        })}>
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
                            aria-label={label}>
                            <Icon color={disabled ? "disabled" : "primary"} />
                        </IconButton>
                    </ConditionalWrapper>
                </Tooltip>
            ))}
        </>
    );
};

export default CardActions;
