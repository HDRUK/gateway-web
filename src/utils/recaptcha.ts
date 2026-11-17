const SCRIPT_ID = "recaptcha-v3";

declare global {
    interface Window {
        grecaptcha?: {
            ready: (callback: () => void) => void;
            execute: (
                siteKey: string,
                options: { action: string }
            ) => Promise<string>;
        };
    }
}

export const loadRecaptcha = (siteKey: string): HTMLScriptElement => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
        return existing as HTMLScriptElement;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
        siteKey
    )}`;
    script.async = true;
    script.addEventListener("error", () => script.remove(), { once: true });
    document.head.appendChild(script);

    return script;
};

const whenLoaded = (script: HTMLScriptElement) =>
    new Promise<void>((resolve, reject) => {
        if (window.grecaptcha) {
            resolve();
            return;
        }
        script.addEventListener("load", () => resolve(), { once: true });
        script.addEventListener(
            "error",
            () => reject(new Error("reCAPTCHA failed to load")),
            { once: true }
        );
    });

export const getRecaptchaToken = async (
    siteKey: string,
    action: string
): Promise<string> => {
    await whenLoaded(loadRecaptcha(siteKey));

    const { grecaptcha } = window;
    if (!grecaptcha) {
        throw new Error("reCAPTCHA is not available");
    }

    await new Promise<void>(resolve => {
        grecaptcha.ready(resolve);
    });

    return grecaptcha.execute(siteKey, { action });
};
