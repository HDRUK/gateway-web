import { render, screen } from "@/utils/testUtils";
import { generateQuestionBankQuestion } from "@/mocks/data/questionBank";
import QuestionBankListItem from "./QuestionBankListItem";

describe("Question Bank Question Card", () => {
    const mockResult = generateQuestionBankQuestion();
    it("should render the title and guidance from the question JSON", async () => {
        render(<QuestionBankListItem data={mockResult} actions={[]} />);
        expect(
            screen.getByText(mockResult.question_json.title)
        ).toBeInTheDocument();

        expect(
            screen.getByText(mockResult.question_json.guidance)
        ).toBeInTheDocument();

        expect(
            screen.getByText(mockResult.locked ? "Locked" : "Available")
        ).toBeInTheDocument();
    });
});
