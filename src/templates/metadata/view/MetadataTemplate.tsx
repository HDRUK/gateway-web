import { MetadataViewContext } from "@/templates/metadata/view/baseComponents";
import { getMetadataTemplate } from "@/templates/metadata/view/registry";

export interface MetadataTemplateProps {
    schemaName: string;
    schemaVersion: string;
    context: MetadataViewContext;
}

const MetadataTemplate = ({
    schemaName,
    schemaVersion,
    context,
}: MetadataTemplateProps) => {
    const { Template, makeComponents } = getMetadataTemplate(
        schemaName,
        schemaVersion
    );

    return (
        <Template
            title={context.title}
            data={context.data}
            schema={context.schema}
            dataCustodianName={context.dataCustodianName}
            components={makeComponents(context)}
        />
    );
};

export default MetadataTemplate;
