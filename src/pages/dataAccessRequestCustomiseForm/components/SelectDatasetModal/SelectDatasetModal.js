import React, { Fragment, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import TypeaheadDataset from '../TypeaheadDataset/TypeaheadDataset';
import './SelectDatasetModal.scss';
import SVGIcon from '../../../../images/SVGIcon';

const SelectDatasetModal = ({ isOpen, closeModal, duplicateApplication }) => {
	let [selectedDatasets, setSelectedDatasets] = useState([]);

	const onHandleDataSetChange = (value = []) => {
		setSelectedDatasets(value);
	};

	const onCloseModal = () => {
		resetModalState();
		closeModal();
	};

	const resetModalState = () => {
		setSelectedDatasets([]);
	};

	return (
		<Fragment>
			<Modal
				show={isOpen}
				onHide={onCloseModal}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
				className='selectDatasetModal'>
				<div className='selectDatasetModal-header'>
					<h1 className='black-20-semibold'>Select the datasets you need</h1>
					<CloseButtonSvg className='selectDatasetModal-head--close' onClick={() => onCloseModal()} />

					<div className='selectDatasetModal-header-description'>
						Search for datasets you wish to add to your new data access request application. Only datasets with matching form application
						processes will be available to select from. If you can’t find the dataset you need, you will need to start a new data access
						request application.
					</div>
				</div>

				<div className='selectDatasetModal-body'>
					<div className='selectDatasetModal-body--group'>
						<label className='gray800-14'>Datasets</label>
						<div className='ds-search'>
							<div className='ds-search-icon'>
								<SVGIcon name='searchicon' width={20} height={20} fill={'#475da7'} />
							</div>
							<div className='ds-search-input'>
								<TypeaheadDataset
									selectedDatasets={selectedDatasets}
									onHandleDataSetChange={onHandleDataSetChange}
									readOnly={false}
									allowAllCustodians={true}
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='selectDatasetModal-footer'>
					<div className='selectDatasetModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={onCloseModal}>
							No, nevermind
						</Button>
						<Button
							variant='primary'
							className='white-14-semibold'
							onClick={() => {
								duplicateApplication('', selectedDatasets);
							}}>
							Duplicate application
						</Button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default SelectDatasetModal;
