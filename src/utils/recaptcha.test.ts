import { getRecaptchaToken, loadRecaptcha } from "./recaptcha";

const scripts = () =>
    document.querySelectorAll<HTMLScriptElement>(
        'script[src^="https://www.google.com/recaptcha/api.js"]'
    );

describe("recaptcha", () => {
    beforeEach(() => {
        scripts().forEach(script => script.remove());
        delete window.grecaptcha;
    });

    it("adds Google's script once for the site key", () => {
        loadRecaptcha("site-key");
        loadRecaptcha("site-key");

        expect(scripts()).toHaveLength(1);
        expect(scripts()[0].src).toBe(
            "https://www.google.com/recaptcha/api.js?render=site-key"
        );
    });

    it("returns a token for the action once the script has loaded", async () => {
        const execute = jest.fn().mockResolvedValue("recaptcha-token");
        const token = getRecaptchaToken("site-key", "experiment_response");

        window.grecaptcha = { ready: callback => callback(), execute };
        scripts()[0].dispatchEvent(new Event("load"));

        await expect(token).resolves.toBe("recaptcha-token");
        expect(execute).toHaveBeenCalledWith("site-key", {
            action: "experiment_response",
        });
    });

    it("rejects when Google's script fails to load", async () => {
        const token = getRecaptchaToken("site-key", "experiment_response");

        scripts()[0].dispatchEvent(new Event("error"));

        await expect(token).rejects.toThrow();
    });

    it("retries with a new script when an earlier load failed", async () => {
        const failed = loadRecaptcha("site-key");
        failed.dispatchEvent(new Event("error"));

        const execute = jest.fn().mockResolvedValue("recaptcha-token");
        const token = getRecaptchaToken("site-key", "experiment_response");

        expect(scripts()).toHaveLength(1);
        expect(scripts()[0]).not.toBe(failed);

        window.grecaptcha = { ready: callback => callback(), execute };
        scripts()[0].dispatchEvent(new Event("load"));

        await expect(token).resolves.toBe("recaptcha-token");
    });
});
