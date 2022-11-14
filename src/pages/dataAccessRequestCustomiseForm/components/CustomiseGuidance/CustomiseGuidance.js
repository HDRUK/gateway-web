import { convertFromRaw, EditorState } from 'draft-js';
import { debounce } from 'lodash';
import { markdownToDraft } from 'markdown-draft-js';
import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { WysiwygEditor } from '../../../commonComponents/WysiwygEditor/WysiwygEditor';

const CustomiseGuidance = ({ activeGuidance, onGuidanceChange, activeQuestion, activePanel }) => {
    const [editorState, setEditorState] = useState(null);

    const debounceChange = useCallback(
        debounce(guidanceAsMarkdown => {
            return onGuidanceChange(activeQuestion, guidanceAsMarkdown);
        }, 1500),
        [activeQuestion]
    );

    const handleGuidanceChange = markdown => {
        debounceChange(markdown);
    };

    const handleEditorStateChange = React.useCallback(
        editorStateChanged => {
            setEditorState(editorStateChanged);
        },
        [activeQuestion]
    );

    React.useEffect(() => {
        if (activeQuestion) {
            const contentState = convertFromRaw(markdownToDraft(activeGuidance));
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [activeQuestion]);

    if (activePanel?.panelGuidance && !activeQuestion) {
        return <ReactMarkdown source={activePanel.panelGuidance} linkTarget='_blank' />;
    }

    return (
        <>
            {editorState && (
                <WysiwygEditor
                    data-testid='wysiwyg-editor'
                    editorState={editorState}
                    onEditorStateChange={handleEditorStateChange}
                    onMarkdownChange={handleGuidanceChange}
                />
            )}
        </>
    );
};

export default CustomiseGuidance;
