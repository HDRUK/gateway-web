import escapeHtml from "escape-html";
import { Descendant, Text } from "slate";
import { Blocks } from "@/interfaces/Wysiwyg";

function parseEncodedJSON(value?: string | null) {
    try {
        return value ? JSON.parse(value?.replace(/\\|&quot;/g, '\\"')) : value;
    } catch (_) {
        return value;
    }
}

const slateSerialiseJsonToHtml = (node: Descendant): string => {
    console.log("NODE", node);
    if (node.type === "text") {
        let value = escapeHtml(node.text);

        let tags = "";

        node.marks.forEach(mark => {
            if (node.bold) {
                tags = `<strong>${tags}</strong>`;
            } else if (node.italic) {
                tags = `<em>${tags}</em>`;
            } else if (node.underline) {
                value = `<u>${tags}</u>`;
            }
        });

        return value;
    }

    const children = node?.children?.content
        .map((n: Descendant) => slateSerialiseJsonToHtml(n))
        .join("");

    switch (node.type) {
        case BlocksType.NUMBERED_LIST:
            return `<ol>${children}</ol>`;
        case Blocks.PARAGRAPH:
            return `<p>${children}</p>`;
        default:
            return children;
    }
};

const slateJsonToHtml = (data: Descendant[]) => {
    const value = slateSerialiseJsonToHtml({
        children: data,
    });

    return value;
};

export { parseEncodedJSON, slateJsonToHtml };
