"use client";

import ReactFlow, {
    Node,
    Edge,
    ConnectionLineType,
    ReactFlowProps,
} from "reactflow";
import "reactflow/dist/style.css";
import CircleNode from "./CircleNode";
import MindMapEdge from "./MindMapEdge";
import RectangleNode from "./RectangleNode";

export interface MindMapProps extends ReactFlowProps {
    rootNode: Node;
    outerNodes: Node[];
    initialEdges: Edge[];
    connectionLineStyle: React.CSSProperties;
}

const MindMap = ({
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
    ...rest
}: MindMapProps) => {
    const nodeTypes = { circle: CircleNode, rect: RectangleNode };

    const edgeTypes = {
        mindmap: MindMapEdge,
    };

    const initialNodes = [rootNode, ...outerNodes];

    const defaultEdgeOptions = {
        style: connectionLineStyle,
    };

    const proOptions = { hideAttribution: true };

    return (
        <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineStyle={connectionLineStyle}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.Straight}
            nodeOrigin={[0.5, 0.5]}
            proOptions={proOptions}
            fitView
            {...rest}
        />
    );
};

export default MindMap;
