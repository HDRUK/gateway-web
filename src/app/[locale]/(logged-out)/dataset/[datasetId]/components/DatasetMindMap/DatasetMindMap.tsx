"use client";

import { useMemo } from "react";
import { tokens } from "@hdruk/ui/theme";
import { ReactFlowProps } from "@xyflow/react";
import { useTranslations } from "next-intl";
import { VersionItem } from "@/interfaces/Dataset";
import MindMap from "@/components/MindMap/MindMap";
import Paper from "@/components/Paper";
import {
    rootNode,
    outerNodeValues,
    getOuterNodes,
    initialEdges,
    connectionLineStyle,
} from "@/config/mindmaps/dataset";
import { getSectionAnchorId, scrollToSection } from "@/utils/dataset";
import { DatasetSection } from "../../config";

const TRANSLATION_PATH = "pages.dataset.components.DatasetMindMap";

const PREFERRED_HEIGHT = 370;

interface DatasetMindMapProps extends ReactFlowProps {
    data: VersionItem;
    teamId: number;
    isCohortDiscovery: boolean;
    populatedSections: DatasetSection[];
    hasStructuralMetadata: boolean;
    hasDemographics: boolean;
    linkageCounts: { [key: string]: number };
}

const DatasetMindMap = ({
    data,
    teamId,
    isCohortDiscovery,
    populatedSections,
    linkageCounts,
    panOnDrag = false,
    panOnScroll = false,
    zoomOnScroll = false,
    zoomOnPinch = false,
    zoomOnDoubleClick = false,
    nodesDraggable = false,
    hasStructuralMetadata,
    hasDemographics,
    ...rest
}: DatasetMindMapProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const hydratedRootNode = useMemo(
        () => ({
            ...rootNode,
            data: {
                ...rootNode.data,
                label: "Dataset",
            },
        }),
        [data, t]
    );

    const { hydratedOuterNodes, emptyNodes } = useMemo(() => {
        const empty: string[] = [];

        const outerNodes = getOuterNodes(
            outerNodeValues.map(node => ({
                ...node,
                label: t(node.name),
            }))
        );

        const nodes = outerNodes
            .map(node => {
                let href: string | null = null;
                let action: (() => void) | null = null;
                let hidden = false;
                let cohort = false;
                let { label } = node.data;
                let labelPrefix: string | undefined;

                const { title } = data.metadata.metadata.summary;
                const safeTitle = encodeURIComponent(title);

                if (node.id === "node-synthetic") {
                    href =
                        data.metadata.metadata?.structuralMetadata
                            ?.syntheticDataWebLink[0];

                    if (!href) {
                        empty.push(node.id);
                        hidden = true;
                    }
                } else if (
                    ["node-collections", "node-durs", "node-tools"].includes(
                        node.id
                    )
                ) {
                    const entityName = node.id.replace("node-", "");
                    const entityCount = linkageCounts[entityName];

                    if (!entityCount) {
                        hidden = true;
                        empty.push(node.id);
                    }

                    href = `${node.data.href}&datasetTitles=${safeTitle}`;
                } else if (node.id === "node-dataCustodian") {
                    href = `/data-custodian/${teamId}`;
                    label =
                        data.metadata.metadata.summary.dataCustodian?.name ||
                        node.data.label;
                    labelPrefix = node.data.label;
                } else if (node.id === "node-curatedPublications") {
                    const entityCount = linkageCounts.publications_using;
                    if (!entityCount) {
                        hidden = true;
                        empty.push(node.id);
                    }
                    href = `${node.data.href}&query=&datasetTitles=${safeTitle}&source=${node.data.source}&force`;
                } else if (node.id === "node-externalPublications") {
                    href = `${node.data.href}&query=${safeTitle}&source=${node.data.source}&pmc=dataset`;
                } else if (node.id === "node-coverageCompleteness") {
                    href =
                        data.metadata.metadata?.coverage?.datasetCompleteness;

                    if (!href) {
                        empty.push(node.id);
                        hidden = true;
                    }
                } else if (node.id === "node-cohortDiscovery") {
                    href = node.data.href;
                    cohort = node.data.cohort;

                    if (!isCohortDiscovery) {
                        empty.push(node.id);
                        hidden = true;
                    }
                } else if (node.data.href?.includes("scrollTo:")) {
                    const sectionName = node.data.href.replace("scrollTo:", "");
                    const canScrollToSection =
                        ((hasStructuralMetadata &&
                            node.data.name === "structuralMetadata") ||
                            (hasDemographics &&
                                node.data.name === "demographics")) &&
                        populatedSections.some(
                            section => section.sectionName === sectionName
                        );

                    if (canScrollToSection) {
                        href = null;
                        action = () =>
                            scrollToSection(getSectionAnchorId(sectionName));
                    } else {
                        hidden = true;
                        empty.push(node.id);
                    }
                }

                return {
                    ...node,
                    hidden,
                    data: {
                        ...node.data,
                        label,
                        labelPrefix,
                        href,
                        action,
                        cohort,
                    },
                };
            })
            .filter(Boolean);

        return {
            hydratedOuterNodes: nodes,
            emptyNodes: empty,
        };
    }, [
        data,
        t,
        linkageCounts,
        teamId,
        isCohortDiscovery,
        hasStructuralMetadata,
        hasDemographics,
        populatedSections,
    ]);

    return (
        <Paper sx={{ borderRadius: `${tokens.radius.medium}px` }}>
            <MindMap
                panOnDrag={panOnDrag}
                panOnScroll={panOnScroll}
                zoomOnScroll={zoomOnScroll}
                zoomOnPinch={zoomOnPinch}
                zoomOnDoubleClick={zoomOnDoubleClick}
                nodesDraggable={nodesDraggable}
                {...rest}
                aria-label={t("label")}
                preferredHeight={PREFERRED_HEIGHT}
                rootNode={hydratedRootNode}
                outerNodes={hydratedOuterNodes}
                initialEdges={initialEdges.filter(
                    edge => !emptyNodes.includes(edge.target)
                )}
                connectionLineStyle={connectionLineStyle}
            />
        </Paper>
    );
};

export default DatasetMindMap;
