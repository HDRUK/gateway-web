import { Handle, Position, NodeProps } from "@xyflow/react";
import theme from "@/config/theme";
import CohortDiscoveryButton from "@/app/[locale]/(logged-out)/about/cohort-discovery/components/CohortDiscoveryButton";

export interface CohortDiscoveryNodeData {
    id: string;
    label: string;
    href: string;
    nodeSx: React.CSSProperties;
    color: string;
    position: Position;
    hidden: boolean;
}

const CohortDiscoveryNode = ({
    data: { id, label, href, nodeSx, position, color, hidden, action, ctaLink },
}: NodeProps<CohortDiscoveryNodeData>) => {

    console.log('ctaLink', ctaLink);

    return (
        <div
            style={{
                color: "white",
                background: href
                    ? color
                    : action
                    ? color
                    : theme.palette.greyCustom.main,
                padding: "14px",
                ...nodeSx,
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? "none" : "inherit",
            }}>
            <Handle type="target" position={position} id={`${id}.bottom`} />
            <div
                id={id}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                }}>
                <CohortDiscoveryButton
                    // ctaLink={{
                    //     url: "http://localhost:3000/en/about/cohort-discovery-request",
                    //     title: "Access Cohort Discovery",
                    // }}
                    
                    ctaLink={ctaLink}
                    
                    variant="link"
                />
            </div>
        </div>
    );
};

export default CohortDiscoveryNode;
