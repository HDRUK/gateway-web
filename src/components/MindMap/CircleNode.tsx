import { Node, Position, NodeProps } from "@xyflow/react";
import theme from "@/config/theme";
import EllipsisLineLimit from "../EllipsisLineLimit";
import { HiddenHandle } from "./MindMap.styles";
import { ROOT_SIZE } from "./layout";

export type CircleNodeData = {
    id: string | number;
    label: string;
    size?: number;
};

const CircleNode = ({
    data: { id, label, size = ROOT_SIZE },
}: NodeProps<Node<CircleNodeData>>) => {
    return (
        <div
            style={{
                backgroundColor: theme.palette.greyCustom.light,
                height: size,
                width: size,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                position: "relative",
            }}>
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: theme.spacing(0, 2),
                    gap: "5px",
                }}>
                <EllipsisLineLimit text={label} maxLine={3} showToolTip />
            </div>
            <HiddenHandle
                type="source"
                position={Position.Left}
                id={`${id}.connector`}
                isConnectableStart={false}
                style={{ left: "50%" }}
            />
        </div>
    );
};

export default CircleNode;
