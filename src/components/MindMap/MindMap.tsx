"use client";

import ReactFlow, { Node, Edge, ConnectionLineType } from "reactflow";
import "reactflow/dist/style.css";
import CircleNode from "./CircleNode";
import MindMapEdge from "./MindMapEdge";
import RectangleNode from "./RectangleNode";

export interface MindMapProps {
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
}: MindMapProps) => {
    const nodeTypes = { circle: CircleNode, rect: RectangleNode };

    const edgeTypes = {
        mindmap: MindMapEdge,
    };

    const initialNodes = [rootNode, ...outerNodes];

    const defaultEdgeOptions = {
        style: connectionLineStyle,
    };

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineStyle={connectionLineStyle}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.Straight}
                nodeOrigin={[0.5, 0.5]}
                fitView
            />
        </div>
    );
};

export default MindMap;
