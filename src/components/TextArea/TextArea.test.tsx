import React from "react";
import TextArea from "@/components/TextArea";
import { useForm } from "react-hook-form";
import { render, screen } from "@/utils/testUtils";

describe("TextArea", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = ({ ...props }: any) => {
        const { control } = useForm();
        return (
            <TextArea
                label="This is a label"
                name="description"
                control={control}
                {...props}
            />
        );
    };
    it("should render label", async () => {
        render(<Component />);

        expect(screen.getByText("This is a label")).toBeInTheDocument();
    });
    it("should render placeholder", async () => {
        render(<Component placeholder="This is a placeholder" />);

        expect(
            screen.getByPlaceholderText("This is a placeholder")
        ).toBeInTheDocument();
    });
    it("should render info", async () => {
        render(<Component info="This is info" />);

        expect(screen.getByText("This is info")).toBeInTheDocument();
    });

    it("should render character count/limit", async () => {
        render(<Component limit={500} />);

        expect(screen.getByText("500 character limit")).toBeInTheDocument();
        expect(screen.getByText("(500/500)")).toBeInTheDocument();
    });
});
