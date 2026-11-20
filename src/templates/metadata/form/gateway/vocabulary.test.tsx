import { useEffect } from "react";
import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import {
    MetadataFormProvider,
    useFormSections,
} from "@hdruk/metadata-onboard/client";
import useGet from "@/hooks/useGet";
import { act, render, screen } from "@/utils/testUtils";
import { GatewayFormContext } from "./GatewayFormContext";
import { gatewayInputs } from "./gatewayInputs";
import { StructuralMetadataUpload, TeamPicker } from "./vocabulary";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock("@/hooks/useGet", () => ({
    __esModule: true,
    default: jest.fn(() => ({ data: undefined, isLoading: false })),
}));

const schema = {
    type: "object",
    properties: {
        summary: {
            type: "object",
            properties: {
                dataCustodian: {
                    type: "object",
                    properties: { identifier: { type: "string" } },
                },
            },
        },
        structuralMetadata: {
            type: "object",
            properties: {
                tables: { type: "array", items: { type: "object" } },
            },
        },
    },
} as unknown as JSONSchemaDocument;

const ActivateSection = ({ section }: { section?: string }) => {
    const { setActiveSection } = useFormSections();
    useEffect(() => {
        if (section) {
            setActiveSection(section);
        }
    }, [section, setActiveSection]);
    return null;
};

const renderTag = (
    tag: React.ReactNode,
    { isCollab, section }: { isCollab: boolean; section?: string }
) =>
    render(
        <GatewayFormContext.Provider
            value={{
                schema,
                model: "HDRUK",
                version: "4.1.0",
                teamId: "7",
                defaultTeam: { value: 7, label: "Example Team" },
                isCollab,
            }}>
            <MetadataFormProvider schema={schema} components={gatewayInputs}>
                <ActivateSection section={section} />
                {tag}
            </MetadataFormProvider>
        </GatewayFormContext.Provider>
    );

const fetchedUrls = () =>
    jest
        .mocked(useGet)
        .mock.calls.filter(([, options]) => options?.shouldFetch !== false)
        .map(([url]) => url);

describe("gateway vocabulary in collab mode", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("TeamPicker", () => {
        it("shows the team as the fixed custodian, without searching teams", () => {
            renderTag(<TeamPicker path="summary.dataCustodian.identifier" />, {
                isCollab: true,
            });

            expect(screen.getByText("Example Team")).toBeInTheDocument();
            expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
            expect(useGet).not.toHaveBeenCalled();
        });

        it("still offers the team search for team members", () => {
            renderTag(<TeamPicker path="summary.dataCustodian.identifier" />, {
                isCollab: false,
            });

            expect(screen.getByRole("combobox")).toBeInTheDocument();
            expect(fetchedUrls()).toEqual([]);
        });
    });

    describe("StructuralMetadataUpload", () => {
        it("explains the team adds structural metadata, instead of an upload that needs a login", async () => {
            renderTag(<StructuralMetadataUpload path="structuralMetadata" />, {
                isCollab: true,
                section: "structuralMetadata",
            });

            await act(async () => undefined);
            expect(
                screen.getByText(/the team can add structural metadata/i)
            ).toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: /upload/i })
            ).not.toBeInTheDocument();
        });
    });
});
