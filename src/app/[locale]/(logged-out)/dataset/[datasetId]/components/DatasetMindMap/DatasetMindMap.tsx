"use client";

import { useMemo } from "react";
import { VersionItem } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import MindMap from "@/components/MindMap";
import Paper from "@/components/Paper";
import {
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";

const DatasetMindMap = ({ data }: { data: VersionItem }) => {
    const hydratedOuterNodes = useMemo(
        () =>
            outerNodes.map(node => {
                let href = null;
                const title = data.metadata.metadata.summary.shortTitle;

                if (node.id === "node-synthetic") {
                    href = data.metadata.metadata.linkage.syntheticDataWebLink;
                } else if (
                    ["node-collections", "node-dur", "node-tools"].includes(
                        node.id
                    )
                ) {
                    href = `${node.data.href}&query=${title}`;
                }
                return {
                    ...node,
                    data: {
                        ...node.data,
                        href,
                    },
                };
            }),
        [data]
    );

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 3" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2, height: "350px" }}>
                    <MindMap
                        rootNode={rootNode}
                        outerNodes={hydratedOuterNodes}
                        initialEdges={initialEdges}
                        connectionLineStyle={connectionLineStyle}
                        panOnDrag={false}
                        panOnScroll={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                    />
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DatasetMindMap;
