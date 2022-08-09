import React, { useState } from 'react';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { has, isEmpty } from 'lodash';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { Button, Modal } from 'react-bootstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import publishersService from '../../../../services/publishers';
import { WysiwygEditor } from '../../../commonComponents/WysiwygEditor/WysiwygEditor';
import handleAnalytics from '../../../dataAccessRequestCustomiseForm/handleAnalytics';
import './CustomiseDAREditGuidance.scss';

const baseURL = require('../../../commonComponents/BaseURL').getURL();

export const CustomiseDAREditGuidance = ({ show, onHide, publisherDetails }) => {
    const { t } = useTranslation();
    const body =
        has(publisherDetails, 'dataRequestModalContent.body') && !isEmpty(publisherDetails.dataRequestModalContent.body)
            ? publisherDetails.dataRequestModalContent.body
            : t('DAR.customise.presubmissionGuidance.defaultGuidance');
    const publisherName = publisherDetails.publisherDetails.name;
    const [contentState] = useState(convertFromRaw(markdownToDraft(body)));
    const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const publishersRequest = publishersService.usePatchModalContent(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const handleConfirmOk = React.useCallback(() => {
        const content = draftToMarkdown(convertToRaw(editorState.getCurrentContent()));

        const { _id } = publisherDetails;

        publishersRequest
            .mutateAsync({
                _id,
                content,
            })
            .then(() => {
                onHide(`
                    You have successfully updated and published the ${publisherDetails.name} application form and ‘How to request access’ information
                `);
            });
        handleAnalytics('Clicked Publish button', 'Presubmission guidance');
    }, [publisherDetails._id, editorState.getCurrentContent()]);

    const handlePublish = React.useCallback(() => {
        setShowConfirm(true);
    }, []);

    const handleConfirmCancel = React.useCallback(() => {
        setShowConfirm(false);
    }, []);

    const handleCancel = React.useCallback(() => {
        setShowCancel(true);
    }, []);

    const handleCancelCancel = React.useCallback(() => {
        setShowCancel(false);
    }, []);

    const handleCancelOk = React.useCallback(() => {
        onHide();
    }, []);

    let modalContent = {
        header: t('DAR.customise.presubmissionGuidance.modal.title'),
        body: t('DAR.customise.presubmissionGuidance.modal.description', { publisherName }),
        cancel: (
            <Button variant='medium' className='cancelButton dark-14 mr-2' onClick={handleCancel} data-testid='cancel-publish'>
                {t('buttons.cancel')}
            </Button>
        ),
        confirm: (
            <Button
                disabled={disabled}
                data-testid='publish-guidance'
                variant='primary'
                className='publishButton white-14-semibold'
                type='submit'
                onClick={handlePublish}>
                {t('buttons.publish')}
            </Button>
        ),
    };

    if (showConfirm) {
        modalContent = {
            header: t('DAR.customise.presubmissionGuidance.modal.publish.title'),
            body: t('DAR.customise.presubmissionGuidance.modal.publish.description', { publisherName }),
            cancel: (
                <Button
                    variant='medium'
                    className='cancelButton dark-14 mr-2'
                    onClick={handleConfirmCancel}
                    data-testid='confirm-cancel-publish'>
                    {t('buttons.neverMind')}
                </Button>
            ),
            confirm: (
                <Button
                    data-test-id='add-collection-publish'
                    variant='primary'
                    className='publishButton white-14-semibold'
                    type='submit'
                    onClick={handleConfirmOk}>
                    {t('DAR.customise.presubmissionGuidance.modal.publish.confirm')}
                </Button>
            ),
        };
    } else if (showCancel) {
        modalContent = {
            header: t('DAR.customise.presubmissionGuidance.modal.cancel.title'),
            body: t('DAR.customise.presubmissionGuidance.modal.cancel.description'),
            cancel: (
                <Button variant='medium' className='cancelButton dark-14 mr-2' onClick={handleCancelCancel} data-testid='confirm-cancel'>
                    {t('buttons.neverMind')}
                </Button>
            ),
            confirm: (
                <Button
                    data-test-id='add-collection-publish'
                    variant='primary'
                    className='publishButton white-14-semibold'
                    type='submit'
                    onClick={handleCancelOk}>
                    {t('buttons.cancel')}
                </Button>
            ),
        };
    }

    return (
        <Modal show={show} onHide={onHide} className={showConfirm || showCancel ? 'modal-md' : 'modal-xl'}>
            <Modal.Header>
                <h1 className='black-20-semibold' data-testid='modalHeading'>
                    {modalContent.header}
                </h1>
            </Modal.Header>
            <Modal.Body>
                <p className='soft-black-14' data-testid='modalDesc'>
                    <span dangerouslySetInnerHTML={{ __html: modalContent.body }} />
                </p>
                {!showConfirm && !showCancel && (
                    <WysiwygEditor
                        data-testid='wysiwyg-editor'
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        onMarkdownChange={() => setDisabled(false)}
                    />
                )}
            </Modal.Body>
            <Modal.Footer>
                <div>{modalContent.cancel}</div>
                <div className={!showCancel && !showConfirm && 'd-flex justify-content-end flex-grow'}>{modalContent.confirm}</div>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomiseDAREditGuidance;
