"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    Node,
    NodeChange,
    Edge,
    ConnectionLineType,
    FitViewOptions,
    ReactFlowProps,
    useReactFlow,
    useStore,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { isEqual } from "lodash";
import CircleNode from "./CircleNode";
import MindMapEdge from "./MindMapEdge";
import RectangleNode from "./RectangleNode";
import {
    MAX_ZOOM,
    MIN_ZOOM,
    Size,
    getRadialLayout,
    getStackedLayout,
    isStackedWidth,
    orderOuterNodes,
} from "./layout";

export interface MindMapProps extends ReactFlowProps {
    rootNode: Node;
    outerNodes: Node[];
    initialEdges: Edge[];
    connectionLineStyle: React.CSSProperties;
    preferredHeight?: number;
}

const READY_FALLBACK_MS = 1000;

const UNMEASURED: Size = { width: 0, height: 0 };

const nodeTypes = { circle: CircleNode, rect: RectangleNode };

const edgeTypes = { mindmap: MindMapEdge };

const proOptions = { hideAttribution: true };

const ariaLabelConfig = {
    "node.a11yDescription.default": "",
    "edge.a11yDescription.default": "",
};

const FitViewOnChange = ({
    options,
    nodes,
}: {
    options?: FitViewOptions;
    nodes: Node[];
}) => {
    const { fitView } = useReactFlow();
    const width = useStore(state => state.width);
    const height = useStore(state => state.height);

    useEffect(() => {
        fitView(options);
    }, [width, height, nodes, fitView, options]);

    return null;
};

const MindMapFlow = ({
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
    preferredHeight,
    onNodesChange,
    ...rest
}: MindMapProps) => {
    const flowRef = useRef<HTMLDivElement>(null);
    const width = useStore(state => state.width);
    const [measuredSizes, setMeasuredSizes] = useState<Record<string, Size>>(
        {}
    );
    const [isReady, setIsReady] = useState(false);

    const orderedOuterNodes = useMemo(
        () => orderOuterNodes(rootNode, outerNodes),
        [rootNode, outerNodes]
    );

    const rootSize = measuredSizes[rootNode.id] ?? UNMEASURED;
    const outerSizes = useMemo(
        () =>
            orderedOuterNodes.map(node => measuredSizes[node.id] ?? UNMEASURED),
        [orderedOuterNodes, measuredSizes]
    );

    const isMeasured =
        rootSize.width > 0 && outerSizes.every(size => size.width > 0);

    if (!isReady && width > 0 && isMeasured) {
        setIsReady(true);
    }

    useEffect(() => {
        const timeout = setTimeout(() => setIsReady(true), READY_FALLBACK_MS);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (flowRef.current) {
            // React Flow hard-codes role="application", which stops screen
            // readers browsing the diagram's plain links and text.
            flowRef.current.setAttribute("role", "group");
        }
    }, []);

    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setMeasuredSizes(current =>
                changes.reduce(
                    (next, change) =>
                        change.type === "dimensions" &&
                        change.dimensions &&
                        !isEqual(next[change.id], change.dimensions)
                            ? { ...next, [change.id]: change.dimensions }
                            : next,
                    current
                )
            );

            if (onNodesChange) {
                onNodesChange(changes);
            }
        },
        [onNodesChange]
    );

    const isStacked = isStackedWidth(width);

    const { nodes, contentHeight, isWrapping } = useMemo(() => {
        const input = {
            rootNode,
            outerNodes: orderedOuterNodes,
            rootSize,
            outerSizes,
            width,
        };

        return isStacked
            ? getStackedLayout(input)
            : getRadialLayout({ ...input, preferredHeight });
    }, [
        isStacked,
        rootNode,
        orderedOuterNodes,
        rootSize,
        outerSizes,
        width,
        preferredHeight,
    ]);

    const fitViewOptions = useMemo(
        () =>
            isStacked || isWrapping
                ? { ...rest.fitViewOptions, minZoom: 1, maxZoom: 1 }
                : rest.fitViewOptions,
        [isStacked, isWrapping, rest.fitViewOptions]
    );

    const edges = useMemo(
        () =>
            isStacked
                ? initialEdges.map(edge => ({
                      ...edge,
                      type: "smoothstep",
                      pathOptions: { offset: 0 },
                  }))
                : initialEdges,
        [isStacked, initialEdges]
    );

    const defaultEdgeOptions = {
        style: connectionLineStyle,
        domAttributes: { "aria-hidden": true },
    };

    return (
        <div
            style={{
                height: contentHeight ?? preferredHeight ?? "100%",
                visibility: isReady ? "visible" : "hidden",
            }}>
            <ReactFlow
                ref={flowRef}
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineStyle={connectionLineStyle}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.Straight}
                nodeOrigin={[0.5, 0.5]}
                proOptions={proOptions}
                ariaLabelConfig={ariaLabelConfig}
                preventScrolling={false}
                nodesFocusable={false}
                edgesFocusable={false}
                elementsSelectable={false}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                fitView
                {...rest}
                onNodesChange={handleNodesChange}
                disableKeyboardA11y>
                <FitViewOnChange options={fitViewOptions} nodes={nodes} />
            </ReactFlow>
        </div>
    );
};

const MindMap = (props: MindMapProps) => (
    <ReactFlowProvider>
        <MindMapFlow {...props} />
    </ReactFlowProvider>
);

export default MindMap;
