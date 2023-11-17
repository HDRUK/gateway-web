import { IconButton } from "@mui/material";
import Link from "@/components/Link";
import Tooltip from "@/components/Tooltip";
import { ReactNode } from "react";
import { IconType } from "@/interfaces/Ui";
import ConditionalWrapper from "../ConditionalWrapper";

interface CardActionsProps {
    id: number;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
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
            {actions.map(({ icon: Icon, href, label, action }) => (
                <Tooltip key={label} placement="left" title={label}>
                    <ConditionalWrapper
                        requiresWrapper={!!href}
                        wrapper={linkWrapper({
                            href,
                            id,
                        })}>
                        <IconButton
                            {...(action && {
                                onClick: () => {
                                    action(id);
                                },
                            })}
                            disableRipple
                            size="large"
                            aria-label={label}>
                            <Icon color="primary" />
                        </IconButton>
                    </ConditionalWrapper>
                </Tooltip>
            ))}
        </>
    );
};

export default CardActions;
