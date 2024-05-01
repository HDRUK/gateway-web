import { Handle, Position, NodeProps } from "reactflow";
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
}

const RectangleNode = ({
    data: { id, label, href, nodeSx, position, color },
}: NodeProps<RectangleNodeData>) => {
    return (
        <div
            style={{
                color: "white",
                background: href ? color : theme.palette.greyCustom.main,
                padding: "14px",
                ...nodeSx,
            }}>
            <Handle type="target" position={position} id={`${id}.bottom`} />
            {href ? (
                <Link
                    href={href}
                    underline="none"
                    color="inherit"
                    target="_blank"
                    rel="noopener noreferrer">
                    <div
                        id={id}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                        }}>
                        {label} <LaunchIcon fontSize="small" />
                    </div>
                </Link>
            ) : (
                <div id={id}>{label}</div>
            )}
        </div>
    );
};

export default RectangleNode;
