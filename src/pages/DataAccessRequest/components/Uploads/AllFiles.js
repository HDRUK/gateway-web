import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import Image from 'react-bootstrap/Image';
import { Button, Modal } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { concatFileName, fileStatus, readableFileSize } from './files.util';
import { ReactComponent as PaperSVG } from '../../../../images/paper.svg';
import { ReactComponent as ArrowDownSVG } from '../../../../images/arrow-down.svg';
import { ReactComponent as SmallAttentionSVG } from '../../../../images/attention.svg';
import { ReactComponent as TrashSVG } from '../../../../images/trash-alt-solid.svg';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import { SUPPORT_CREATE_URL } from '../../../../configs/constants';

export const AllFiles = ({ files, downloadFile, deleteFile, readOnly }) => {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [fileToDelete, setFileToDelete] = useState({});

    const getOwner = file => {
        const { owner } = file;
        if (!_.isEmpty(owner)) {
            const { firstname = '', lastname = '' } = owner;
            return `${firstname} ${lastname}`;
        }
        return '-';
    };

    const renderScan = () => {
        return (
            <>
                <div className='all-files-spinner'>
                    <Image width='100px' height='100px' src={require('../../../../images/spinner.gif')} />
                </div>
            </>
        );
    };

    const renderDownload = file => {
        if (file.status === fileStatus.ERROR) {
            return '';
        }
        return (
            <div className='all-files-download' onClick={e => downloadFile(file)}>
                <ArrowDownSVG />
            </div>
        );
    };

    const renderDelete = file => {
        if (file.status === fileStatus.ERROR) {
            return '';
        }
        return (
            <div className='all-files-download' onClick={e => renderDeleteModal(true, file)}>
                <TrashSVG />
            </div>
        );
    };

    const postDelete = file => {
        deleteFile(file);
        renderDeleteModal(false);
    };

    const renderDeleteModal = (show, file = {}) => {
        setShowDeleteModal(show);
        setFileToDelete(file);
    };

    return (
        <div className='all-files'>
            <h1 className='black-20-semibold'>All Files</h1>
            <div className='all-files file-table header'>
                <div className='column gray800-14-bold'>File</div>
                <div className='column gray800-14-bold'>File description</div>
                <div className='column gray800-14-bold'>Uploaded by</div>
            </div>
            <>
                {files.length > 0 &&
                    files.map((file, index) => {
                        const { name, status, description } = file;

                        return (
                            <div className='all-files file-table' key={`all-files-${index}`}>
                                <div className='column all-files-file'>
                                    <PaperSVG />
                                    <div className='all-files-file--meta'>
                                        <span>{concatFileName(file)}</span>
                                        <span className='gray700-alt-13'>{readableFileSize(file)}</span>
                                    </div>
                                </div>
                                <div className='column all-files-desc'>
                                    {status === fileStatus.ERROR ? (
                                        <div className='error-alert'>
                                            <SmallAttentionSVG />
                                            <div>
                                                <Trans i18nKey='DAR.upload.virus.error'>
                                                    {{ name }},<a href={SUPPORT_CREATE_URL} target='_blank' />
                                                </Trans>
                                            </div>
                                        </div>
                                    ) : status === fileStatus.QUARANTINED ? (
                                        <div className='error-alert'>
                                            <div>
                                                <SmallAttentionSVG />
                                                {t('DAR.upload.virus.quarantined', { name })}
                                            </div>
                                        </div>
                                    ) : (
                                        <>{description}</>
                                    )}
                                </div>
                                <div className='column all-files-user'>
                                    {status === fileStatus.ERROR || status === fileStatus.QUARANTINED ? '' : getOwner(file)}
                                    {status === fileStatus.SCANNED
                                        ? renderDownload(file)
                                        : status === fileStatus.NEWFILE || status === fileStatus.UPLOADED
                                        ? renderScan()
                                        : ''}
                                    {status === fileStatus.SCANNED && !readOnly ? renderDelete(file) : ''}
                                </div>
                            </div>
                        );
                    })}

                <Modal
                    show={showDeleteModal}
                    onHide={() => {
                        renderDeleteModal(false);
                    }}
                    aria-labelledby='contained-modal-title-vcenter'
                    centered
                    className='workflowModal'>
                    <div className='workflowModal-header'>
                        <h1 className='black-20-semibold'>Confirm action?</h1>
                        <CloseButtonSvg className='workflowModal-header--close' onClick={() => renderDeleteModal(false)} />
                    </div>

                    <div className='workflowModal-body'>This file will be deleted from the Gateway and Discourse.</div>
                    <div className='workflowModal-footer'>
                        <div className='workflowModal-footer--wrap'>
                            <Button variant='white' className='techDetailButton mr-2' onClick={() => renderDeleteModal(false)}>
                                No, nevermind
                            </Button>
                            <Button
                                variant='primary'
                                className='white-14-semibold'
                                onClick={() => {
                                    postDelete(fileToDelete);
                                }}>
                                Yes, confirm action
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        </div>
    );
};

export default AllFiles;
