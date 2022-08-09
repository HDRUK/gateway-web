import { convertToRaw } from 'draft-js';
import { draftToMarkdown } from 'markdown-draft-js';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Wysiwyg.scss';

export const WysiwygEditor = ({ editorState, onEditorStateChange, onContentStateChange, onMarkdownChange }) => {
    const [markdown, setMarkdown] = React.useState();
    const ref = React.createRef(null);

    const handleOnEditorStateChange = editorStateChanged => {
        const guidanceAsMarkdown = draftToMarkdown(convertToRaw(editorStateChanged.getCurrentContent()));

        onEditorStateChange(editorStateChanged);

        if (markdown !== guidanceAsMarkdown) onMarkdownChange(guidanceAsMarkdown, editorStateChanged);
    };


    React.useEffect(() => {
        setMarkdown(draftToMarkdown(convertToRaw(editorState.getCurrentContent())));
    }, []);

    return (
        <Editor
            data-testid='wysiwyg-editor-main'
            wrapperClassName='demo-wrapper'
            editorClassName='wysiwyg-wrapper'
            toolbarClassName='rdw-editor-toolbar'
            editorState={editorState}
            onEditorStateChange={handleOnEditorStateChange}
            onContentStateChange={onContentStateChange}
            ref={ref}

            toolbar={{
                options: ['inline', 'blockType', 'list', 'link', 'history'],
                inline: {
                    inDropdown: false,
                    options: ['bold', 'italic'],
                },
                blockType: {
                    inDropdown: false,
                    options: ['Normal', 'H1', 'H2'],
                },
                list: {
                    options: ['unordered', 'ordered'],
                },
                link: {
                    options: ['link'],
                },
                history: {
                    options: ['undo', 'redo'],
                },
            }}
        />
    );
};

WysiwygEditor.defaultProps = {
    onMarkdownChange: () => {},
    onEditorStateChange: () => {},
    onContentStateChange: () => {},

};

export default WysiwygEditor;
