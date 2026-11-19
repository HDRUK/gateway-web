import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import useAuth from "@/hooks/useAuth";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { getRecaptchaToken, loadRecaptcha } from "@/utils/recaptcha";
import { render, screen } from "@/utils/testUtils";
import { useFeatures } from "@/providers/FeatureProvider";
import Experiments from "./Experiments";

jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/useGet");
jest.mock("@/hooks/usePost");
jest.mock("@/providers/FeatureProvider", () => ({
    useFeatures: jest.fn(),
}));

jest.mock("@/utils/recaptcha");

const experiment = {
    id: 7,
    name: "Search feedback",
    paths: ["/en/search"],
    trigger: { on: "load", frequency: "untilAnswered" },
    definition: {
        steps: [
            {
                id: "only",
                blocks: [
                    { id: "note", type: "textInput", label: "Anything else?" },
                ],
            },
        ],
    },
    variant: null,
};

const post = jest.fn();

const signIn = (user?: object) =>
    (useAuth as jest.Mock).mockReturnValue({
        isLoggedIn: !!user,
        isLoading: false,
        user,
    });

describe("Experiments", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "site-key";
        (getRecaptchaToken as jest.Mock).mockResolvedValue("recaptcha-token");
        document.cookie = "hdruk-experiments=; max-age=0; path=/";
        mockRouter.setCurrentUrl("/en/search");
        (useFeatures as jest.Mock).mockReturnValue({
            isExperimentsEnabled: true,
        });
        (useGet as jest.Mock).mockReturnValue({ data: [experiment] });
        (usePost as jest.Mock).mockReturnValue(post);
        post.mockResolvedValue(true);
    });

    it("does not fetch or show a prompt when the feature is off", () => {
        (useFeatures as jest.Mock).mockReturnValue({
            isExperimentsEnabled: false,
        });
        signIn();
        render(<Experiments />);

        expect(useGet).toHaveBeenCalledWith(
            `${apis.experimentsV1Url}/active`,
            expect.objectContaining({ shouldFetch: false })
        );
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("sends an anonymous response with the typed email when they opt in", async () => {
        signIn();
        const user = userEvent.setup();
        render(<Experiments />);

        await user.click(
            await screen.findByRole("checkbox", { name: "Yes, contact me" })
        );
        await user.type(
            screen.getByRole("textbox", { name: /Email address/ }),
            "user@example.com"
        );
        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(useGet).toHaveBeenCalledWith(
            `${apis.experimentsV1Url}/active`,
            expect.anything()
        );
        expect(usePost).toHaveBeenLastCalledWith(
            `${apis.experimentsV1Url}/7/responses`,
            expect.anything()
        );
        expect(post).toHaveBeenCalledWith({
            answers: {},
            path: "/en/search",
            variant: null,
            contact: true,
            email: "user@example.com",
            recaptcha: "recaptcha-token",
        });
        expect(loadRecaptcha).toHaveBeenCalledWith("site-key");
        expect(getRecaptchaToken).toHaveBeenCalledWith(
            "site-key",
            "experiment_response"
        );
    });

    it("uses the signed-in routes and does not send an email", async () => {
        signIn({ email: "user@example.com", preferred_email: "primary" });
        const user = userEvent.setup();
        render(<Experiments />);

        await user.click(
            await screen.findByRole("checkbox", { name: "Yes, contact me" })
        );
        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(useGet).toHaveBeenCalledWith(
            `${apis.experimentsV1Url}/active/me`,
            expect.anything()
        );
        expect(usePost).toHaveBeenLastCalledWith(
            `${apis.experimentsV1Url}/7/responses/me`,
            expect.anything()
        );
        expect(post).toHaveBeenCalledWith({
            answers: {},
            path: "/en/search",
            variant: null,
            contact: true,
            recaptcha: "recaptcha-token",
        });
    });
});
