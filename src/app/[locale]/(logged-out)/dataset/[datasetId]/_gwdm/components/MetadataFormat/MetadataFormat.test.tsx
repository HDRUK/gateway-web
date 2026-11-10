import { SCHEMA_BRANCH } from "@/consts/schema";
import { render, screen } from "@/utils/testUtils";
import MetadataFormat from "./MetadataFormat";

const props = {
    sourceSchema: { model: "CRUK", version: "1.0.0" },
    partner: "CRUK",
    metadataVersion: "1.2.0",
    issued: "2020-08-05T14:35:59Z",
    modified: "2021-01-28T14:15:46Z",
};

const row = (label: string) =>
    screen.getByText(`${label}:`).closest("p") as HTMLElement;

describe("MetadataFormat", () => {
    it("titles the panel", () => {
        render(<MetadataFormat {...props} />);

        expect(
            screen.getByRole("heading", { name: "Metadata format" })
        ).toBeInTheDocument();
    });

    it("shows the partner", () => {
        render(<MetadataFormat {...props} />);

        expect(row("Partner")).toHaveTextContent("CRUK");
    });

    it("shows the schema the dataset was submitted in, and its version", () => {
        render(<MetadataFormat {...props} />);

        expect(row("Schema")).toHaveTextContent("CRUK");
        expect(row("Schema version")).toHaveTextContent("1.0.0");
    });

    it("links to the submitted schema's definition inline, in the Schema row", () => {
        render(<MetadataFormat {...props} />);

        const link = screen.getByRole("link", {
            name: "View CRUK 1.0.0 schema definition",
        });

        expect(link).toHaveAttribute(
            "href",
            `https://github.com/HDRUK/schemata-2/tree/${SCHEMA_BRANCH}/hdr_schemata/models/CRUK/1.0.0`
        );
        expect(link).toHaveTextContent("schema definition");
        expect(row("Schema")).toContainElement(link);
        expect(row("Schema")).toHaveTextContent("CRUK (schema definition)");
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });

    it("shows the schema without a version or link when the version is unknown", () => {
        // GMI pull ingestion records HDRUK but not which version.
        render(
            <MetadataFormat
                {...props}
                sourceSchema={{ model: "HDRUK", version: null }}
            />
        );

        expect(row("Schema")).toHaveTextContent("HDRUK");
        expect(screen.queryByText("Schema version:")).not.toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("omits the schema rows and link when no source schema was recorded", () => {
        render(<MetadataFormat {...props} sourceSchema={null} />);

        expect(screen.queryByText(/Schema/)).not.toBeInTheDocument();
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("never names GWDM or how the dataset was onboarded", () => {
        // GWDM is the Gateway's internal storage model; the schema shown is
        // the partner ingestion standard the dataset was submitted in.
        render(<MetadataFormat {...props} />);

        expect(
            screen.queryByText(/GWDM|Gateway Working Data Model/)
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Onboarded via:")).not.toBeInTheDocument();
    });

    it("shows the record's own version and dates as DD/MM/YYYY", () => {
        render(<MetadataFormat {...props} />);

        expect(row("Metadata version")).toHaveTextContent("1.2.0");
        expect(row("First published")).toHaveTextContent("05/08/2020");
        expect(row("Last modified")).toHaveTextContent("28/01/2021");
    });

    it("omits rows the record has no value for", () => {
        render(
            <MetadataFormat
                {...props}
                metadataVersion={undefined}
                issued={undefined}
                modified={undefined}
            />
        );

        expect(screen.queryByText("Metadata version:")).not.toBeInTheDocument();
        expect(screen.queryByText("First published:")).not.toBeInTheDocument();
        expect(screen.queryByText("Last modified:")).not.toBeInTheDocument();
    });
});
