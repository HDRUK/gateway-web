import { Button } from "@hdruk/ui";
import { Handle, Position, NodeProps } from "@xyflow/react";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Link from "@/components/Link";
import theme from "@/config/theme";
import { LaunchIcon } from "@/consts/icons";

export interface RectangleNodeData {
    id: string;
    label: string;
    href: string;
    nodeSx: React.CSSProperties;
    color: string;
    position: Position;
    hidden: boolean;
}

/**
 * Nodes sit on a saturated background, so their content is always light. Set
 * explicitly rather than inherited: the library reads `color="inherit"` on a
 * text Button as "neutral grey", so inheritance alone would not reach it.
 */
const NODE_CONTENT_COLOR = theme.palette.common.white;

const RectangleNode = ({
    data: { id, label, href, nodeSx, position, color, hidden, action, cohort },
}: NodeProps<RectangleNodeData>) => {
    if (hidden) return null;

    return (
        <div
            style={{
                color: NODE_CONTENT_COLOR,
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
                    sx={{
                        p: 0,
                        lineHeight: "inherit",
                        color: NODE_CONTENT_COLOR,
                    }}>
                    {label}
                </Button>
            ) : cohort ? (
                <CohortDiscoveryButton
                    showDatasetExplanatoryTooltip
                    color="inherit"
                    variant="text"
                    sx={{
                        p: 0,
                        lineHeight: "inherit",
                        color: NODE_CONTENT_COLOR,
                    }}
                />
            ) : (
                <div id={id}>{label}</div>
            )}
        </div>
    );
};

export default RectangleNode;
