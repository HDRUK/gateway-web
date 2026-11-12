import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import {
    FormField,
    MetadataFormProvider,
} from "@hdruk/metadata-onboard/client";
import { fireEvent, render, screen } from "@/utils/testUtils";
import traserSchema from "@/mocks/data/dataset/onboarding/traserSchema";
import { gatewayInputs } from "./gatewayInputs";

jest.mock("@/components/InputWrapper", () => ({
    __esModule: true,
    default: ({ component, name }: { component: string; name: string }) => (
        <div
            data-testid="gateway-input"
            data-component={component}
            data-name={name}
        />
    ),
}));

jest.mock("@/components/DatePickerControlled", () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => (
        <div
            data-testid="gateway-input"
            data-component="DatePicker"
            data-name={name}
        />
    ),
}));

const hdruk = traserSchema("HDRUK", "4.1.0");
const schema = hdruk as JSONSchemaDocument;
const describeWithTraser = hdruk ? describe : describe.skip;

describeWithTraser("gatewayInputs", () => {
    it("renders HDRUK's dataset types as today's theme checkboxes and subtype rows", () => {
        render(
            <MetadataFormProvider schema={schema} components={gatewayInputs}>
                <FormField path="provenance.origin.datasetType" />
            </MetadataFormProvider>
        );
        expect(screen.getAllByRole("checkbox")).toHaveLength(12);

        fireEvent.click(
            screen.getByRole("checkbox", { name: "Health and disease" })
        );

        expect(
            screen
                .getAllByTestId("gateway-input")
                .map(input => input.getAttribute("data-component"))
        ).toEqual(["TextField", "Autocomplete"]);
    });
});
