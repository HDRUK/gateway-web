import { Button } from "@hdruk/ui";
import { Node, Position, NodeProps } from "@xyflow/react";
import { useTranslations } from "next-intl";
import CohortDiscoveryButton from "@/components/CohortDiscoveryButton";
import Link from "@/components/Link";
import theme from "@/config/theme";
import { LaunchIcon } from "@/consts/icons";
import { HiddenHandle, HiddenText, NodeBox } from "./MindMap.styles";

const TRANSLATION_PATH = "components.MindMap";

export type RectangleNodeData = {
    id: string | number;
    label: string;
    labelPrefix?: string;
    href?: string | null;
    action?: (() => void) | null;
    cohort?: boolean;
    nodeSx?: React.CSSProperties;
    color: string;
    position: Position;
};

/**
 * Nodes sit on a saturated background, so their content is always light. Set
 * explicitly rather than inherited: the library reads `color="inherit"` on a
 * text Button as "neutral grey", so inheritance alone would not reach it.
 */
const NODE_CONTENT_COLOR = theme.palette.common.white;

const RectangleNode = ({
    data: {
        id,
        label,
        labelPrefix,
        href,
        action,
        cohort,
        nodeSx,
        position,
        color,
    },
}: NodeProps<Node<RectangleNodeData>>) => {
    const t = useTranslations(TRANSLATION_PATH);

    const prefix = labelPrefix && <HiddenText>{`${labelPrefix}: `}</HiddenText>;

    return (
        <NodeBox
            style={{
                color: NODE_CONTENT_COLOR,
                background:
                    href || action || cohort
                        ? color
                        : theme.palette.greyCustom.main,
                padding: "14px",
                ...nodeSx,
                pointerEvents: "auto",
            }}>
            <HiddenHandle
                type="target"
                position={position}
                id={`${id}.bottom`}
                isConnectableStart={false}
            />
            {href ? (
                <Link
                    href={href}
                    underline="none"
                    color="inherit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                    }}>
                    {prefix}
                    {label}
                    <LaunchIcon fontSize="inherit" />
                    <HiddenText>{t("opensInNewTab")}</HiddenText>
                </Link>
            ) : action ? (
                <Button
                    onClick={action}
                    color="inherit"
                    variant="text"
                    sx={{
                        p: 0,
                        lineHeight: "inherit",
                        color: NODE_CONTENT_COLOR,
                    }}>
                    {prefix}
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
                <div>
                    {prefix}
                    {label}
                </div>
            )}
        </NodeBox>
    );
};

export default RectangleNode;
