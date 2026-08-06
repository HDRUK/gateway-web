import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";
import { StructuralMetadata } from "@/interfaces/Dataset";
import apis from "@/config/apis";
import { server } from "@/mocks/server";
import { render } from "@/utils/testUtils";
import StructuralMetadataSection from "./StructuralMetadata";

const metadata: StructuralMetadata[] = [
    {
        name: "patients",
        description: "Patient records",
        columns: [
            {
                name: "nhs_number",
                description: "Identifier",
                dataType: "string",
                sensitive: true,
                values: [],
            },
        ],
    },
];

const renderSection = (structuralMetadata: StructuralMetadata[]) =>
    render(
        <StructuralMetadataSection
            structuralMetadata={structuralMetadata}
            fileProcessedAction={jest.fn()}
            handleToggleUploading={jest.fn()}
            onRemove={jest.fn()}
        />
    );

const StatefulSection = ({
    initial = [],
}: {
    initial?: StructuralMetadata[];
}) => {
    const [tables, setTables] = useState<StructuralMetadata[]>(initial);

    return (
        <StructuralMetadataSection
            structuralMetadata={tables}
            fileProcessedAction={setTables}
            handleToggleUploading={jest.fn()}
            onRemove={() => setTables([])}
        />
    );
};

describe("StructuralMetadata", () => {
    it("renders the uploaded file row and the metadata accordion", () => {
        renderSection(metadata);

        expect(
            screen.getByRole("button", { name: /^Remove file/ })
        ).toBeInTheDocument();
        expect(screen.getByText("patients")).toBeInTheDocument();
    });

    it("renders neither the file row nor the accordion when there is no metadata", () => {
        renderSection([]);

        expect(
            screen.queryByRole("button", { name: /^Remove file/ })
        ).not.toBeInTheDocument();
        expect(screen.queryByText("patients")).not.toBeInTheDocument();
    });

    it("shows the uploaded filename once the file has been processed", async () => {
        server.use(
            rest.post(apis.fileUploadV1Url, (req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({ data: { uuid: "file-uuid" } })
                )
            ),
            rest.get(`${apis.fileUploadV1Url}/file-uuid`, (req, res, ctx) =>
                res(
                    ctx.status(200),
                    ctx.json({
                        data: {
                            uuid: "file-uuid",
                            filename: "dictionary.xlsx",
                            status: "PROCESSED",
                            structural_metadata: metadata,
                        },
                    })
                )
            )
        );

        render(<StatefulSection />);

        const fileInput = screen
            .getByLabelText("Select file")
            .querySelector("input") as HTMLInputElement;

        fireEvent.change(fileInput, {
            target: { files: [new File(["test"], "dictionary.xlsx")] },
        });
        fireEvent.click(screen.getByText("Upload"));

        expect(
            await screen.findByRole("button", {
                name: "Remove file dictionary.xlsx",
            })
        ).toBeInTheDocument();
        expect(screen.getByText("patients")).toBeInTheDocument();
    });

    it("clears the metadata and the filename when the file is removed", () => {
        render(<StatefulSection initial={metadata} />);

        fireEvent.click(screen.getByRole("button", { name: /^Remove file/ }));

        expect(screen.queryByText("patients")).not.toBeInTheDocument();
    });
});
