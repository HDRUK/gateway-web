// __mocks__/next-intl.ts
import type React from "react";
import messages from "@/config/messages/en.json";

// Resolve a dot-path like "modules.dialogs.ProvidersDialog.socialProviders.azure"
function resolvePath(path: string | undefined): any {
    if (!path) return messages as any;

    return path.split(".").reduce<any>((acc, part) => {
        if (acc && typeof acc === "object" && part in acc) {
            return acc[part as keyof typeof acc];
        }
        return undefined;
    }, messages);
}

export const NextIntlClientProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => children;

export function useTranslations(namespace?: string) {
    const makeFullPath = (key: string) =>
        namespace && namespace.length ? `${namespace}.${key}` : key;

    // Base translator: t("key", { var: "value" })
    const t = ((key: string, vars?: Record<string, unknown>) => {
        const fullPath = makeFullPath(key);
        const value = resolvePath(fullPath);

        if (typeof value === "string") {
            // Very simple interpolation for things like {status}
            if (vars && Object.keys(vars).length) {
                return value.replace(/\{(\w+)\}/g, (_, name: string) => {
                    const v = vars[name];
                    return v == null ? "" : String(v);
                });
            }
            return value;
        }

        // Fallback – better to see the key than crash
        return key;
    }) as any;

    // Rich translator: t.rich("key", { componentName: chunks => <Component>{chunks}</Component> })
    t.rich = (
        key: string,
        components: Record<string, (chunks: React.ReactNode) => React.ReactNode>
    ) => {
        const fullPath = makeFullPath(key);
        const raw = resolvePath(fullPath);

        if (typeof raw !== "string") {
            // If the message isn't a string, just fall back to the key
            return key;
        }

        const nodes: React.ReactNode[] = [];
        const tagRegex = /<(\w+)>(.*?)<\/\1>/g;

        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = tagRegex.exec(raw)) !== null) {
            const [full, tagName, inner] = match;
            const index = match.index;

            // Push plain text before the tag
            if (index > lastIndex) {
                nodes.push(raw.slice(lastIndex, index));
            }

            const compFn = components[tagName];
            if (compFn) {
                nodes.push(compFn(inner));
            } else {
                // If no component provided, just push the inner text
                nodes.push(inner);
            }

            lastIndex = index + full.length;
        }

        // Trailing text after the last tag
        if (lastIndex < raw.length) {
            nodes.push(raw.slice(lastIndex));
        }

        return nodes;
    };

    return t;
}

// Optional helpers for any code that uses them
export function useLocale() {
    return "en";
}

export function useFormatter() {
    return {
        format: (v: unknown) => v,
    };
}
