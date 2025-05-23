import { BaseEdge, EdgeProps, getStraightPath } from "@xyflow/react";

const MindMapEdge = (props: EdgeProps) => {
    const { sourceX, sourceY, targetX, targetY } = props;

    const [edgePath] = getStraightPath({
        sourceX,
        sourceY: sourceY + 20,
        targetX,
        targetY,
    });

    return <BaseEdge path={edgePath} {...props} />;
};

export default MindMapEdge;
