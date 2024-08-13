"use client";

import { useMemo } from "react";
import { ReactFlowProps } from "reactflow";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import MindMap from "@/components/MindMap/MindMap";
import Paper from "@/components/Paper";
import {
    rootNode,
    outerNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";
import { DatasetSection } from "../../config";

const TRANSLATION_PATH = "pages.dataset.components.DatasetMindMap";

interface DatasetMindMapProps extends ReactFlowProps {
    data: VersionItem;
    teamId: number;
    populatedSections: DatasetSection[];
    hasStructuralMetadata: boolean;
    linkageCounts: { [key: string]: number };
}

const DatasetMindMap = ({
    data,
    teamId,
    populatedSections,
    linkageCounts,
    panOnDrag = false,
    panOnScroll = false,
    zoomOnScroll = false,
    zoomOnPinch = false,
    zoomOnDoubleClick = false,
    nodesDraggable = false,
    hasStructuralMetadata,
    ...rest
}: DatasetMindMapProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const hydratedRootNode = useMemo(() => {
        return {
            ...rootNode,
            data: {
                ...rootNode.data,
                label:
                    data.metadata.metadata.summary.publisher.name ||
                    t(rootNode.data.name),
                href: `/data-custodian/${teamId}`,
            },
        };
    }, [data, t]);

    const hydratedOuterNodes = useMemo(
        () =>
            outerNodes
                .map(node => {
                    let href = null;
                    let action = null;
                    const title = data.metadata.metadata.summary.shortTitle;

                    if (node.id === "node-synthetic") {
                        href =
                            data.metadata.metadata.linkage.syntheticDataWebLink;
                        if (!href) {
                            return undefined;
                        }
                    } else if (
                        [
                            "node-collections",
                            "node-durs",
                            "node-tools",
                        ].includes(node.id)
                    ) {
                        const entityName = node.id.replace("node-", "");
                        const entityCount = linkageCounts[entityName];
                        if (!entityCount) {
                            return undefined;
                        }
                        href = `${node.data.href}&datasetTitles=${title}`;
                    }

                    if (node.data.href?.includes("scrollTo:")) {
                        if (hasStructuralMetadata) {
                            const sectionIndex = populatedSections.findIndex(
                                section =>
                                    node.data.href?.includes(
                                        section.sectionName
                                    )
                            );

                            href = null;
                            action = () =>
                                document
                                    ?.querySelector(`#anchor${sectionIndex}`)
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                        } else {
                            return undefined;
                        }
                    }

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: t(node.data.name),
                            href,
                            action,
                        },
                    };
                })
                .filter(item => !!item),
        [data]
    );

    return (
        <Paper sx={{ borderRadius: 2, p: 2, height: "350px" }}>
            <MindMap
                panOnDrag={panOnDrag}
                panOnScroll={panOnScroll}
                zoomOnScroll={zoomOnScroll}
                zoomOnPinch={zoomOnPinch}
                zoomOnDoubleClick={zoomOnDoubleClick}
                nodesDraggable={nodesDraggable}
                {...rest}
                rootNode={hydratedRootNode}
                outerNodes={hydratedOuterNodes}
                initialEdges={initialEdges}
                connectionLineStyle={connectionLineStyle}
            />
        </Paper>
    );
};

export default DatasetMindMap;
