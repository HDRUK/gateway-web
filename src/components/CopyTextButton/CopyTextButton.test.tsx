import { render, screen } from "@/utils/testUtils";
import CopyTextButton from "./CopyTextButton";

describe("CopyTextButton", () => {
    it("should render component", async () => {
        render(<CopyTextButton content={"content to copy"}/>);
        expect(screen.getByText("content to copy")).toBeInTheDocument();
        expect(screen.getByRole("button",{name: "copy text"})).toBeInTheDocument();
    });
});
