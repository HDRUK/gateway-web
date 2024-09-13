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
    if (Text.isText(node)) {
        let value = escapeHtml(node.text);

        if (node.bold) {
            value = `<strong>${value}</strong>`;
        } else if (node.italic) {
            value = `<em>${value}</em>`;
        } else if (node.underline) {
            value = `<u>${value}</u>`;
        }

        return value;
    }

    const children = node?.children
        .map((n: Descendant) => slateSerialiseJsonToHtml(n))
        .join("");

    switch (node.type) {
        case Blocks.LIST_ITEM:
            return `<li>${children}</li>`;
        case Blocks.BULLETED_LIST:
            return `<ul {...attributes}>{children}</ul>`;
        case Blocks.NUMBERED_LIST:
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
