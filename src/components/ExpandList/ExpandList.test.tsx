import Typography from "@/components/Typography";
import { act, render, screen, waitFor } from "@/utils/testUtils";
import ExpandList from "./ExpandList";

describe("ExpandList", () => {
    const heading = (
        <>
            <Typography component="span" sx={{ fontWeight: "bold" }}>
                Risus et
            </Typography>{" "}
            pharetra fringill
        </>
    );

    const listItems = [
        "Cras ut sem eu ligula tincidunt aliquet",
        "Lorem ipsum dolor sit amet",
        "Nullam maximus risus et pharetra fringill",
        "Suspendisse porttitor tortor et lectus pulvinar",
    ];
    it("should render component and toggle content", async () => {
        render(<ExpandList heading={heading} listItems={listItems} />);

        expect(screen.getAllByRole("listitem")).toHaveLength(2);

        const button = screen.getByRole("button", { name: "Show more" });

        act(() => {
            button.click();
        });

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(4);
        });
    });
    it("should render component with show less button and toggle content", async () => {
        render(
            <ExpandList
                showLessButton
                heading={heading}
                listItems={listItems}
            />
        );
        const buttonMore = screen.getByRole("button", { name: "Show more" });

        act(() => {
            buttonMore.click();
        });

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(4);
            expect(
                screen.getByRole("button", { name: "Show less" })
            ).toBeInTheDocument();
        });

        const buttonLess = screen.getByRole("button", { name: "Show less" });

        act(() => {
            buttonLess.click();
        });

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2);
        });
    });
});
