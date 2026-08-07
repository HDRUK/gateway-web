import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { generateEmailTemplate } from "@/mocks/data/emailTemplates";
import { render, screen, waitFor } from "@/utils/testUtils";
import EmailTemplateForm from "./EmailTemplateForm";

jest.mock("@/hooks/useGet");
jest.mock("@/hooks/usePost");
jest.mock("@/hooks/usePut");
jest.mock("@/hooks/useDebounce", () => ({
    __esModule: true,
    default: (value: string) => value,
}));

describe("EmailTemplateForm", () => {
    const createTemplate = jest.fn();
    const renderPreview = jest.fn().mockResolvedValue({ html: "<p>preview</p>" });

    beforeEach(() => {
        jest.clearAllMocks();

        (usePost as jest.Mock).mockImplementation((url: string) =>
            url === apis.emailTemplatesPreviewV1Url
                ? renderPreview
                : createTemplate
        );
        (usePut as jest.Mock).mockReturnValue(jest.fn());
        renderPreview.mockResolvedValue({ html: "<p>preview</p>" });
    });

    it("populates the form with the existing template's content when editing", async () => {
        const existingTemplate = generateEmailTemplate({
            id: 7,
            identifier: "dar.status.researcher",
            subject: "Your application status has changed",
            body: "<mjml><mj-body>Hello [[USER_FIRSTNAME]]</mj-body></mjml>",
            enabled: false,
        });

        (useGet as jest.Mock).mockReturnValue({
            data: existingTemplate,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(
            <EmailTemplateForm
                templateId={7}
                onDone={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            screen.getByDisplayValue("dar.status.researcher")
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("Your application status has changed")
        ).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(
                "<mjml><mj-body>Hello [[USER_FIRSTNAME]]</mj-body></mjml>"
            )
        ).toBeInTheDocument();

        const enabledSwitch = screen.getByRole("switch", {
            name: "Enabled",
        });
        expect(enabledSwitch).not.toBeChecked();
    });

    it("renders a live HTML preview of the body via the preview endpoint", async () => {
        const existingTemplate = generateEmailTemplate({
            id: 7,
            body: "<mjml><mj-body>Hello</mj-body></mjml>",
        });

        (useGet as jest.Mock).mockReturnValue({
            data: existingTemplate,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(
            <EmailTemplateForm
                templateId={7}
                onDone={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        await waitFor(() =>
            expect(renderPreview).toHaveBeenCalledWith({
                body: "<mjml><mj-body>Hello</mj-body></mjml>",
            })
        );

        const iframe = await screen.findByTitle("Preview");
        expect(iframe).toHaveAttribute("srcdoc", "<p>preview</p>");
    });
});
