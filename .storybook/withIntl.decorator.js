import { NextIntlClientProvider } from "next-intl";
import messages from "@/config/messages/en.json";

export const withIntl = Story => {
    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            <Story />
        </NextIntlClientProvider>
    );
};
