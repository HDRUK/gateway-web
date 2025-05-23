import { Handle, Position, NodeProps } from "@xyflow/react";
import Link from "@/components/Link";
import theme from "@/config/theme";
import { LaunchIcon } from "@/consts/icons";
import CohortDiscoveryButton from "@/app/[locale]/(logged-out)/about/cohort-discovery/components/CohortDiscoveryButton";
import Button from "../Button";

export interface RectangleNodeData {
    id: string;
    label: string;
    href: string;
    nodeSx: React.CSSProperties;
    color: string;
    position: Position;
    hidden: boolean;
}

const RectangleNode = ({
    data: {
        id,
        label,
        href,
        nodeSx,
        position,
        color,
        hidden,
        action,
        cohort,
        ctaLink,
    },
}: NodeProps<RectangleNodeData>) => {
    if (hidden) return null;

    return (
        <div
            style={{
                color: "white",
                background:
                    href || action || cohort
                        ? color
                        : theme.palette.greyCustom.main,
                padding: "14px",
                ...nodeSx,
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? "none" : "inherit",
            }}>
            <Handle type="target" position={position} id={`${id}.bottom`} />
            {href ? (
                <Link
                    href={href}
                    underline="none"
                    color="inherit"
                    target="_blank"
                    rel="noopener noreferrer"
                    id={id}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                    }}>
                    {label}
                    <LaunchIcon fontSize="small" />
                </Link>
            ) : action ? (
                <Button
                    id={id}
                    onClick={action}
                    color="inherit"
                    variant="text"
                    sx={{ p: 0, lineHeight: "inherit" }}>
                    {label}
                </Button>
            ) : cohort ? (
                <CohortDiscoveryButton
                    ctaLink={ctaLink}
                    showDatasetExplanatoryTooltip
                    color="inherit"
                    variant="text"
                    sx={{ p: 0, lineHeight: "inherit" }}
                />
            ) : (
                <div id={id}>{label}</div>
            )}
        </div>
    );
};

export default RectangleNode;
