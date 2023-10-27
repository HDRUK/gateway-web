import { render, screen, waitFor } from "@/utils/testUtils";
import Typography from "@/components/Typography";
import ExpandSection from "./ExpandSection";

describe("ExpandSection", () => {
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
        render(<ExpandSection heading={heading} listItems={listItems} />);

        expect(screen.getAllByRole("listitem")).toHaveLength(2);

        const button = screen.getByRole("button", { name: "Show more" });

        button.click();

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(4);
        });
    });
    it("should render component with show less button and toggle content", async () => {
        render(
            <ExpandSection
                showLessButton
                heading={heading}
                listItems={listItems}
            />
        );
        const buttonMore = screen.getByRole("button", { name: "Show more" });

        buttonMore.click();

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(4);
            expect(
                screen.getByRole("button", { name: "Show less" })
            ).toBeInTheDocument();
        });

        const buttonLess = screen.getByRole("button", { name: "Show less" });

        buttonLess.click();

        await waitFor(() => {
            expect(screen.getAllByRole("listitem")).toHaveLength(2);
        });
    });
});
