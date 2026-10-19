import { JSONSchemaDocument } from "@/modules/MetadataView";
import { render, screen } from "@/utils/testUtils";
import FieldStrip from "./FieldStrip";

const schema: JSONSchemaDocument = {
    $defs: {
        Required: {
            type: "object",
            properties: {
                version: { type: "string", title: "Version" },
                gatewayPid: { type: "string", title: "Gateway PID" },
            },
        },
    },
    properties: {
        identifier: { type: "string", title: "Identifier" },
        // GWDM wraps every property node around a $ref like this.
        required: { allOf: [{ $ref: "#/$defs/Required" }] },
    },
};

const data = {
    identifier: "abc-123",
    required: { version: "1.0.0", gatewayPid: "pid-1" },
};

describe("FieldStrip", () => {
    it("renders the named top-level fields", () => {
        render(
            <FieldStrip fields={["identifier"]} data={data} schema={schema} />
        );

        expect(screen.getByText("Identifier")).toBeInTheDocument();
        expect(screen.getByText("abc-123")).toBeInTheDocument();
    });

    it("renders fields nested under `path`, resolving the $ref wrapper", () => {
        render(
            <FieldStrip
                path="required"
                fields={["version"]}
                data={data}
                schema={schema}
            />
        );

        expect(screen.getByText("Version")).toBeInTheDocument();
        expect(screen.getByText("1.0.0")).toBeInTheDocument();
        expect(screen.queryByText("Gateway PID")).not.toBeInTheDocument();
    });

    it("renders nothing for a path the schema does not have", () => {
        const { container } = render(
            <FieldStrip
                path="nonsense"
                fields={["version"]}
                data={data}
                schema={schema}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
