import { ReactNode } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import Link from "@/components/Link";
import { DataStatus } from "@/consts/application";
import ConditionalWrapper from "../ConditionalWrapper";

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

const linkWrapper =
    ({
        href,
        id,
        status,
        label,
    }: {
        href?: string;
        id: number;
        status?: string;
        label: string;
    }) =>
    (children: ReactNode) => {
        const searchParams = new URLSearchParams();

        if (status === DataStatus.DRAFT) {
            searchParams.set("status", status);
        }

        if (label.toLowerCase().includes("duplicate")) {
            searchParams.set("duplicate", "true");
        }

        return (
            <Link
                href={`${href}/${id}${
                    searchParams.size ? `?${searchParams}` : ""
                }`}>
                {children}
            </Link>
        );
    };

const CardActions = ({ actions, id, status }: CardActionsProps) => {
    return (
        <>
            {actions.map(({ icon: Icon, href, label, disabled, action }) => (
                <Tooltip key={label} placement="left" title={label}>
                    <div>
                        <ConditionalWrapper
                            requiresWrapper={!!href && !disabled}
                            wrapper={linkWrapper({
                                href,
                                id,
                                status,
                                label,
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
                                <Icon
                                    color={disabled ? "disabled" : "primary"}
                                />
                            </IconButton>
                        </ConditionalWrapper>
                    </div>
                </Tooltip>
            ))}
        </>
    );
};

export default CardActions;
