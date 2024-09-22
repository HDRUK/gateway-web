import { Handle, Position, NodeProps } from "reactflow";
import theme from "@/config/theme";
import EllipsisLineLimit from "../EllipsisLineLimit";

export interface CircleNodeData {
    id: string;
    label: string;
}

const CircleNode = ({ data: { id, label } }: NodeProps<CircleNodeData>) => {
    return (
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
                    padding: "0 15px 0 20px",
                    gap: "5px",
                }}>
                <EllipsisLineLimit text={label} maxLine={3} showToolTip />
            </div>
            <Handle
                type="source"
                position={Position.Left}
                id={`${id}.connector`}
                style={{ left: "50%", opacity: 0 }}
            />
        </div>
    );
};

export default CircleNode;
