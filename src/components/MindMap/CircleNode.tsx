import { Handle, Position, NodeProps } from "reactflow";
import Link from "@/components/Link";
import theme from "@/config/theme";
import { LaunchIcon } from "@/consts/icons";

export interface CircleNodeData {
    id: string;
    label: string;
    href: string;
}

const CircleNode = ({
    data: { id, label, href },
}: NodeProps<CircleNodeData>) => {
    return (
        <Link
            href={href}
            underline="none"
            color="inherit"
            target="_blank"
            rel="noopener noreferrer">
            <div
                style={{
                    backgroundColor: theme.palette.greyCustom.light,
                    height: "150px",
                    width: "150px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    position: "relative",
                }}>
                <div
                    id={id}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                    }}>
                    {label} <LaunchIcon fontSize="small" />
                </div>
                <Handle
                    type="source"
                    position={Position.Left}
                    id={`${id}.connector`}
                    style={{ left: "50%", opacity: 0 }}
                />
            </div>
        </Link>
    );
};

export default CircleNode;
