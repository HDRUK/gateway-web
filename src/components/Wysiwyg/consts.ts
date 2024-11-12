import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

const EXTENSIONS = [
    Document,
    History,
    Paragraph,
    Text,
    Bold,
    Underline,
    Italic,
    Code,
    OrderedList,
    BulletList,
    ListItem,
    Link
];

export { EXTENSIONS };
