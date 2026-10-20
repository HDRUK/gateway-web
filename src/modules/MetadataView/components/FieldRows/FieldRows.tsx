import { ReactNode } from "react";
import { startCase } from "lodash";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import TooltipText from "@/components/TooltipText";
import { RendererProps } from "../../types";
import { collectLeaves } from "../../utils/collectLeaves";
import { rendersAsBlock } from "../../utils/inferRenderStrategy";
import { ResolvedSchemaNode } from "../../utils/resolveSchemaNode";

export interface FieldRowProps {
    label: ReactNode;
    fullWidth?: boolean;
    children: ReactNode;
}

export const FieldRow = ({ label, fullWidth, children }: FieldRowProps) =>
    fullWidth ? (
        <Box sx={{ p: 0, "&:not(:last-of-type)": { mb: 2 } }}>
            <Box sx={{ p: 0, mb: 1 }}>{label}</Box>
            <Box sx={{ p: 0, wordWrap: "break-word" }}>{children}</Box>
        </Box>
    ) : (
        <BoxContainer
            sx={{
                gridTemplateColumns: { lg: "repeat(3, 1fr)" },
                gap: 1,
                p: 0,
                "&:not(:last-of-type)": { mb: 2 },
            }}>
            <Box sx={{ gridColumn: { lg: "span 1" }, p: 0 }}>{label}</Box>
            <Box
                sx={{
                    gridColumn: { lg: "span 2" },
                    p: 0,
                    wordWrap: "break-word",
                }}>
                {children}
            </Box>
        </BoxContainer>
    );

const leafLabel = (resolved: ResolvedSchemaNode, path: string) => {
    const label = resolved.title ?? startCase(path.split(".").pop() ?? path);

    return resolved.description ? (
        <TooltipText content={resolved.description} label={label} />
    ) : (
        <>{label}</>
    );
};

export interface FieldRowsProps extends RendererProps {
    /** Property keys to leave out, matched on a leaf's path or its root segment. */
    exclude?: string[];
}

const FieldRows = ({
    value,
    resolved,
    rootSchema,
    depth,
    path,
    render,
    exclude,
}: FieldRowsProps) => {
    const leaves = collectLeaves(
        resolved.node,
        value,
        rootSchema,
        0,
        "",
        []
    ).filter(
        leaf =>
            !exclude?.some(
                key => key === leaf.path || leaf.path.startsWith(`${key}.`)
            )
    );

    if (!leaves.length) return null;

    return (
        <Box sx={{ p: 0 }}>
            {leaves.map(leaf => (
                <FieldRow
                    key={leaf.path}
                    label={leafLabel(leaf.resolved, leaf.path)}
                    fullWidth={rendersAsBlock(
                        leaf.resolved,
                        leaf.value,
                        rootSchema
                    )}>
                    {render(
                        leaf.resolved,
                        leaf.value,
                        depth + 1,
                        path ? `${path}.${leaf.path}` : leaf.path
                    )}
                </FieldRow>
            ))}
        </Box>
    );
};

export default FieldRows;
