export async function sanitiseHtml(dirty: string) {
    if (typeof window === "undefined") return dirty; // SSR: don’t crash, but also don’t sanitise here

    const mod = await import("dompurify");
    const DOMPurify = mod.default;

    return DOMPurify.sanitize(dirty, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });
}
