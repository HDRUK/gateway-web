import { Handle, Position, NodeProps } from "reactflow";

export interface RectangleNodeData {
    id: string;
    label: string;
    nodeSx: React.CSSProperties;
    color: string;
    position: Position;
}

const RectangleNode = ({
    data: { id, label, nodeSx, position, color },
}: NodeProps<RectangleNodeData>) => {
    return (
        <div
            style={{
                color: "white",
                background: color,
                padding: "14px",
                ...nodeSx,
            }}>
            <Handle type="target" position={position} id={`${id}.bottom`} />
            <div id={id}>{label}</div>
        </div>
    );
};

export default RectangleNode;
