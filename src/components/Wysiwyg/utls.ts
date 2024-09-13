import { Editor, Element as SlateElement } from "slate";
import { Marks } from "@/interfaces/Wysiwyg";

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n[blockType] === format,
        })
    );

    return !!match;
};

const isMarkActive = (editor: Editor, format: Marks) => {
    const marks = Editor.marks(editor);

    return !!marks?.[format];
};

export { isBlockActive, isMarkActive };
