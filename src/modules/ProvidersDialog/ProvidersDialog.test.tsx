import ProvidersDialog from "@/modules/ProvidersDialog";
import { render, screen, waitFor } from "@/utils/testUtils";

describe("ProvidersDialog", () => {
    it("should render component title", async () => {
        render(<ProvidersDialog />);

        await waitFor(() => {
            expect(
                screen.getByText("Sign in or create an account")
            ).toBeInTheDocument();
        });
    });
    it("should render azure link", async () => {
        render(<ProvidersDialog />);
        const azureButton = screen.getByText("Sign in with Azure", {
            exact: false,
        });
        expect(azureButton).toBeInTheDocument();
    });
    it("should render google link", async () => {
        render(<ProvidersDialog />);
        const googleButton = screen.getByText("Sign in with Google", {
            exact: false,
        });
        expect(googleButton).toBeInTheDocument();
    });
    it("should render linkedIn link", async () => {
        render(<ProvidersDialog />);
        const linkedInButton = screen.getByText("Sign in with LinkedIn", {
            exact: false,
        });
        expect(linkedInButton).toBeInTheDocument();
    });
});
