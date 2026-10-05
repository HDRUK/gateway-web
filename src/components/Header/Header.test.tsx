import Header from "@/components/Header";
import {
    render,
    screen,
    waitFor,
    act,
    fireEvent,
    within,
} from "@/utils/testUtils";
import navItems from "@/config/nav";
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
    it("navigation menu offers the site navigation only", async () => {
        await act(() => render(<Header />));

        await act(async () => {
            fireEvent.click(
                screen.getByRole("button", { name: "navigation menu" })
            );
        });

        const menu = await screen.findByRole("menu");
        const expected = navItems
            .filter(item => !item.divider)
            .flatMap(item =>
                item.subItems
                    ? item.subItems.map(subItem => subItem.label)
                    : [item.label]
            );

        expect(
            within(menu)
                .getAllByRole("menuitem")
                .map(item => item.textContent)
        ).toEqual(expected);
    });

    it("logo image is rendered", async () => {
        await act(() => render(<Header />));

        const logoImage = screen.getAllByAltText("HDR UK Gateway");
        expect(logoImage).toHaveLength(1);
    });
});
