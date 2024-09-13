import { useCallback } from "react";
import isHotkey from "is-hotkey";
import { Editor, Element as SlateElement, Transforms } from "slate";
import { Editable, RenderElementProps, RenderLeafProps } from "slate-react";
import { Blocks, Marks, TextAlign } from "@/interfaces/Wysiwyg";
import ElementNode, { ElementNodeProps } from "./ElementNode";
import LeafNode, { LeafNodeProps } from "./LeafNode";
import Toolbar from "./Toolbar";
import { StyledEditorWrapper } from "./Wysiwyg.styles";
import { isBlockActive, isMarkActive } from "./utls";

const LIST_TYPES = [Blocks.BULLETED_LIST, Blocks.NUMBERED_LIST];
const TEXT_ALIGN_TYPES = [
    TextAlign.CENTER,
    TextAlign.JUSTIFY,
    TextAlign.RIGHT,
    TextAlign.LEFT,
];

const HOTKEYS = {
    "mod+b": "bold",
    "mod+i": "italic",
    "mod+u": "underline",
    "mod+`": "code",
};

interface TextEditorProps {
    editor: Editor;
}

function TextEditor({ editor }: TextEditorProps) {
    const changeMark = useCallback((editor: Editor, format: Marks) => {
        const isActive = isMarkActive(editor, format);

        if (isActive) {
            Editor.removeMark(editor, format);
        } else {
            Editor.addMark(editor, format, true);
        }
    }, []);

    const changeBlock = useCallback((editor: Editor, format: any) => {
        const isActive = isBlockActive(
            editor,
            format,
            TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        );
        const isList = LIST_TYPES.includes(format);

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type) &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        });

        let newProperties: Partial<SlateElement>;

        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            };
        } else {
            newProperties = {
                type: isActive
                    ? Blocks.PARAGRAPH
                    : isList
                    ? Blocks.LIST_ITEM
                    : format,
            };
        }

        Transforms.setNodes<SlateElement>(editor, newProperties);

        if (!isActive && isList) {
            const block = { type: format, children: [] };

            Transforms.wrapNodes(editor, block);
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
                event.preventDefault();

                const mark = HOTKEYS[hotkey];

                changeMark(editor, mark);
            }
        }
    };

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        return <LeafNode {...(props as LeafNodeProps)} />;
    }, []);

    const renderElement = useCallback((props: RenderElementProps) => {
        return <ElementNode {...(props as ElementNodeProps)} />;
    }, []);

    return (
        <>
            <Toolbar
                editor={editor}
                onChangeBlock={changeBlock}
                onChangeMark={changeMark}
            />
            <StyledEditorWrapper>
                <Editable
                    onKeyDown={handleKeyDown}
                    renderLeaf={renderLeaf}
                    renderElement={renderElement}
                />
            </StyledEditorWrapper>
        </>
    );
}

export default TextEditor;
