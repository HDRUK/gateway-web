import { useEffect } from "react";
import { JSONSchemaDocument, resolveSchemaNode } from "@hdruk/gwdm-view";
import {
    MetadataFormProvider,
    useFormSections,
} from "@hdruk/metadata-onboard/client";
import { act, render } from "@/utils/testUtils";
import traserSchema from "@/mocks/data/dataset/onboarding/traserSchema";
import { GatewayFormContext } from "./gateway/GatewayFormContext";
import { gatewayInputs } from "./gateway/gatewayInputs";
import {
    FALLBACK_TEMPLATE,
    formTemplateMeta,
    getFormTemplate,
} from "./registry";
import { formVocabulary } from "./vocabulary";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useParams: jest.fn(),
}));

const hdruk = traserSchema("HDRUK", "4.1.0");
const pruk = traserSchema("PRUK", "1.0.0");

const SCHEMAS: [string, string, JSONSchemaDocument | null][] = [
    ["HDRUK", "4.1.0", hdruk],
    ["PRUK", "1.0.0", pruk],
];

type SetSection = (section: string) => void;

const CaptureSections = ({
    onReady,
}: {
    onReady: (set: SetSection) => void;
}) => {
    const { setActiveSection } = useFormSections();
    useEffect(() => onReady(setActiveSection), [onReady, setActiveSection]);
    return null;
};

describe("form templates", () => {
    it("falls back to the generic template for a schema without one", () => {
        expect(
            getFormTemplate({ partner: "CRUK", gwdmVersion: "1.0.0" }).partner
        ).toBe(FALLBACK_TEMPLATE);
    });

    if (!hdruk || !pruk) {
        it.skip("renders each schema's sections (needs Traser)", () => {});
        return;
    }

    describe.each(SCHEMAS)("%s %s", (model, version, document) => {
        const schema = document as JSONSchemaDocument;
        const template = getFormTemplate({
            partner: model,
            gwdmVersion: version,
        });
        const meta = formTemplateMeta(template.meta);
        const sections =
            meta.sections ??
            Object.entries(schema.properties ?? {})
                .filter(
                    ([, node]) =>
                        resolveSchemaNode(node, schema).kind === "object"
                )
                .map(([name]) => name);

        it.each(sections)("renders the %s section", section => {
            const { Template } = template;
            let setActiveSection: SetSection = () => undefined;
            const { container } = render(
                <GatewayFormContext.Provider
                    value={{
                        schema,
                        model,
                        version,
                        teamId: "1",
                    }}>
                    <MetadataFormProvider
                        schema={schema}
                        system={meta.system}
                        sections={meta.sections}
                        components={gatewayInputs}>
                        <CaptureSections
                            onReady={set => {
                                setActiveSection = set;
                            }}
                        />
                        <Template components={formVocabulary} />
                    </MetadataFormProvider>
                </GatewayFormContext.Provider>
            );

            act(() => setActiveSection(section));

            expect(
                container.querySelector("form")?.childElementCount
            ).toBeGreaterThan(0);
        });
    });
});
