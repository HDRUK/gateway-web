import { getRequestConfig } from "next-intl/server";
import messages from "@/config/messages/en.json";

export default getRequestConfig(async () => {
    const locales = ["en"] as const;
    let locale: (typeof locales)[number] = "en";

    return {
        locale,
        messages,
    };
});
