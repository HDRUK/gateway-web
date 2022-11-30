import React, { useEffect } from 'react';
import _ from 'lodash';
import { Button } from 'hdruk-react-core';

import { AlertMessage } from 'components';
import { ReactComponent as PaperSVG } from '../../../../images/paper.svg';
import { ReactComponent as CloseSVG } from '../../../../images/close-alt.svg';

import { concatFileName, fileStatus, readableFileSize } from './files.util';
import FileLoading from './FileLoading';

export const UploadFiles = ({ uploadFiles, submitted, isLoading, onUploadFiles, onRemoveFile, onDescriptionChange }) => {
    const descriptionRequired = file => {
        return _.isEmpty(file.description) && submitted ? <div className='invalid-feedback'>Description required</div> : '';
    };

    const renderUploadButton = () => {
        if (uploadFiles.length > 0) {
            return (
                <>
                    <div className='upload-files-footer'>
                        <Button onClick={e => onUploadFiles(e)} disabled={!uploadFiles.find(({ status }) => status !== fileStatus.ERROR)}>
                            Upload all files
                        </Button>
                    </div>
                </>
            );
        }
        return '';
    };

    useEffect(() => {}, [uploadFiles, submitted, isLoading]);

    return (
        <div className='upload-files'>
            {isLoading ? <FileLoading /> : ''}
            <>
                <div className='upload-files wrap header'>
                    <div className='column gray800-14-bold'>File</div>
                    <div className='column gray800-14-bold'>File description</div>
                </div>
                {uploadFiles.length > 0 &&
                    uploadFiles.map((file, index) => {
                        return (
                            <div className='upload-files wrap'>
                                <div className='column upload-files-file'>
                                    <PaperSVG />
                                    <div className='upload-files-file--meta'>
                                        <span>{concatFileName(file)}</span>
                                        <span className='gray700-alt-13'>{readableFileSize(file)}</span>
                                    </div>
                                </div>
                                <div className='column upload-files-desc'>
                                    {file.status === fileStatus.ERROR ? (
                                        <AlertMessage variant='danger'>{file.error}</AlertMessage>
                                    ) : (
                                        <div className='upload-files-desc--control'>
                                            <div className='upload-files-desc--wrap'>
                                                <input
                                                    className={`form-control ${
                                                        submitted && _.isEmpty(file.description) ? `is-invalid` : ''
                                                    }`}
                                                    type='text'
                                                    name={`description_${file.fileId}`}
                                                    onChange={e => onDescriptionChange(e)}
                                                />
                                                {descriptionRequired(file)}
                                            </div>
                                            <div className='cancel'>
                                                <Button variant='tertiary' iconLeft={<CloseSVG />} onClick={() => onRemoveFile(file)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                {renderUploadButton()}
            </>
        </div>
    );
};

export default UploadFiles;
