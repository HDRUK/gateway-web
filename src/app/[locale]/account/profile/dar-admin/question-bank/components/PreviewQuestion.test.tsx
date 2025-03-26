import { Control } from "react-hook-form";
import { DarApplicationQuestion } from "@/interfaces/DataAccessRequest";
import {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
} from "@/interfaces/QuestionBankQuestion";
import { render, screen } from "@/utils/testUtils";
import PreviewQuestion from "./PreviewQuestion";

jest.mock("@/utils/formHydration", () => ({
    renderFormHydrationField: jest.fn(() => <div>Mocked Field</div>),
}));

describe("PreviewQuestion Component", () => {
    const mockControl = {} as Control<QuestionBankQuestionForm>;

    it("renders 'No question to preview' when question title is missing", () => {
        render(
            <PreviewQuestion
                question={{} as QuestionBankQuestion}
                control={mockControl}
            />
        );
        expect(screen.getByText("No question to preview")).toBeInTheDocument();
    });

    it("renders formatted question when title exists", () => {
        const mockQuestion: QuestionBankQuestion = {
            title: "Sample Question",
            options: [],
        } as QuestionBankQuestion;

        render(
            <PreviewQuestion question={mockQuestion} control={mockControl} />
        );
        expect(screen.getByText("Mocked Field")).toBeInTheDocument();
    });

    it("renders child options when conditions match", () => {
        const mockQuestion: Partial<DarApplicationQuestion> = {
            title: "Question1",
            component: "RadioGroup",
            options: [
                {
                    label: "Option1",
                    children: [
                        {
                            title: "Child1",
                            component: "TextArea",
                        },
                    ],
                },
            ],
            Question1: "Option1",
        };

        render(
            <PreviewQuestion question={mockQuestion} control={mockControl} />
        );
        expect(screen.getAllByText("Mocked Field").length).toEqual(2);
    });
});
