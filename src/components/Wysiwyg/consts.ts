import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";

const EXTENSIONS = [
    Document,
    History,
    Paragraph,
    Text,
    Bold,
    Underline,
    Italic,
    Code,
];

export { EXTENSIONS };
