"use client";

import { useMemo } from "react";
import { ReactFlowProps } from "reactflow";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import MindMap from "@/components/MindMap/MindMap";
import Paper from "@/components/Paper";
import {
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";

const TRANSLATION_PATH = "pages.dataset.components.DatasetMindMap";

interface DatasetMindMapProps extends ReactFlowProps {
    data: VersionItem;
}

const DatasetMindMap = ({
    data,
    panOnDrag = false,
    panOnScroll = false,
    zoomOnScroll = false,
    zoomOnPinch = false,
    zoomOnDoubleClick = false,
    ...rest
}: DatasetMindMapProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const hydratedRootNode = useMemo(() => {
        return {
            ...rootNode,
            data: {
                ...rootNode.data,
                label: t(rootNode.data.name),
            },
        };
    }, [data, t]);

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
                        label: t(node.data.name),
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
                        panOnDrag={panOnDrag}
                        panOnScroll={panOnScroll}
                        zoomOnScroll={zoomOnScroll}
                        zoomOnPinch={zoomOnPinch}
                        zoomOnDoubleClick={zoomOnDoubleClick}
                        {...rest}
                        rootNode={hydratedRootNode}
                        outerNodes={hydratedOuterNodes}
                        initialEdges={initialEdges}
                        connectionLineStyle={connectionLineStyle}
                    />
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DatasetMindMap;
