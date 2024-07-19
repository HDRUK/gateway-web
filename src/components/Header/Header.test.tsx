import Header from "@/components/Header";
import { render, screen, waitFor, act } from "@/utils/testUtils";
import { userV1 } from "@/mocks/data";
import { getAuthInternal } from "@/mocks/handlers/auth";
import { server } from "@/mocks/server";

describe("Header", () => {
    it("renders the header component", async () => {
        server.use(getAuthInternal(null));

        await act(() => render(<Header />));

        const headerComponent = screen.getByRole("banner");
        expect(headerComponent).toBeInTheDocument();
    });
    it("should render logged out component", async () => {
        server.use(getAuthInternal(null));
        await act(() => render(<Header />));

        await waitFor(() => {
            expect(screen.getByText("Sign in")).toBeInTheDocument();
        });
    });
    it("should render logged in component", async () => {
        await act(() => render(<Header />));

        await waitFor(() => {
            expect(screen.getByText(userV1.firstname)).toBeInTheDocument();
        });
    });
    it("menu icon button is rendered", async () => {
        await act(() => render(<Header />));

        const menuIconButton = screen.getByRole("button", {
            name: "navigation menu",
        });
        expect(menuIconButton).toBeInTheDocument();
    });
    it("logo image is rendered", async () => {
        await act(() => render(<Header />));

        const logoImage = screen.getAllByAltText("HDR Gateway logo");
        expect(logoImage).toHaveLength(2);
    });
    // it("on click of sign-in button, opens up sign-in dialog modal", async () => {
    //     server.use(getAuthInternal(null));
    //     await act(() => render(<Header />));

    //     await waitFor(() => {
    //         fireEvent.click(screen.getByText("Sign in"));
    //         expect(
    //             screen.getByText("Google", { exact: false })
    //         ).toBeInTheDocument();
    //     });
    // });
});
