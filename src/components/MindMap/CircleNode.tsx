import { Handle, Position, NodeProps } from "reactflow";

export interface CircleNodeData {
    id: string;
    label: string;
}

const CircleNode = ({ data: { id, label } }: NodeProps<CircleNodeData>) => {
    return (
        <div
            style={{
                backgroundColor: "lightgrey",
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                position: "relative",
            }}>
            <div id={id}>{label}</div>
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
