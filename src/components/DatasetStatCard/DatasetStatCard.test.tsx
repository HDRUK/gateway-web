import { render, screen } from "@/utils/testUtils";
import ImageMediaCard from "./DatasetStatCard";

describe("DatasetInfoCard", () => {
    it("renders the card with image, description, and button text", () => {
        const img = "test.jpg";
        const description = "A description";
        const buttonText = "Learn More";
        const href = "/link";

        render(
            <ImageMediaCard
                img={img}
                description={description}
                buttonText={buttonText}
                href={href}
            />
        );

        const image = screen.getByRole("img");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src", img);

        const descriptionElement = screen.getByText("A description");
        expect(descriptionElement).toBeInTheDocument();

        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(buttonText);
    });
});
