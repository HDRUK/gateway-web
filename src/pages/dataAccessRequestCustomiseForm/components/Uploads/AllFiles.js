import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { concatFileName, fileStatus, readableFileSize } from './files.util';
import { ReactComponent as PaperSVG } from '../../../../images/paper.svg';
import { ReactComponent as ArrowDownSVG } from '../../../../images/arrow-down.svg';
import { ReactComponent as SmallAttentionSVG } from '../../../../images/small-attention.svg';
import { ReactComponent as TrashSVG } from '../../../../images/trash-alt-solid.svg';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import Image from 'react-bootstrap/Image';
import { Button, Modal } from 'react-bootstrap';

export const AllFiles = ({ files, downloadFile, deleteFile, readOnly }) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [fileToDelete, setFileToDelete] = useState({});


	const getOwner = file => {
		let { owner } = file;
		if (!_.isEmpty(owner)) {
			let { firstname = '', lastname = '' } = owner;
			return `${firstname} ${lastname}`;
		}
		return '-';
	};

	const renderScan = () => {
		return (
			<Fragment>
				<div className='all-files-spinner'>
					<Image width='100px' height='100px' src={require('../../../../images/spinner.gif')} />
				</div>
			</Fragment>
		);
	};

	const renderDownload = file => {
		if (file.status === fileStatus.ERROR) {
			return '';
		} else {
			return (
				<div className='all-files-download' onClick={e => downloadFile(file)}>
					<ArrowDownSVG />
				</div>
			);
		}
	};

	const renderDelete = file => {
		if (file.status === fileStatus.ERROR) {
			return '';
		} else {
			return (
				<div className='all-files-download' onClick={e => renderDeleteModal(true, file)}>
					<TrashSVG />
				</div>
			);
		}
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
			<Fragment>
				{files.length > 0 &&
					files.map((file, index) => (
						<div className='all-files file-table' key={`all-files-${index}`}>
							<div className='column all-files-file'>
								<PaperSVG />
								<div className='all-files-file--meta'>
									<span>{concatFileName(file)}</span>
									<span className='gray700-alt-13'>{readableFileSize(file)}</span>
								</div>
							</div>
							<div className='column all-files-desc'>
                                {file.status === fileStatus.ERROR ? (
                                    <Fragment>
                                        <div className='error-alert'>
                                            <SmallAttentionSVG />An unexpected error has occurred
                                        </div>
                                    </Fragment>
                                ) : (file.status === fileStatus.QUARANTINED) ? 
                                    <Fragment>
                                        <div className='error-alert'>
                                            <SmallAttentionSVG />This file is infected and has been quarantined
                                        </div>
                                    </Fragment> : (
                                    <Fragment>{file.description}</Fragment>
                                )}
                            </div>
                            <div className='column all-files-user'>
                                {file.status === fileStatus.ERROR || file.status === fileStatus.QUARANTINED ? '' : getOwner(file)}
                                {file.status === fileStatus.SCANNED ? renderDownload(file) : ((file.status === fileStatus.NEWFILE || file.status === fileStatus.UPLOADED) ? renderScan() : '')}
                                {file.status === fileStatus.SCANNED && !readOnly ? renderDelete(file) : ''}
                            </div>
                        </div>
                    ))}

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
			</Fragment>
		</div>
	);
};

export default AllFiles;
