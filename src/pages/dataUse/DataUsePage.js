import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import axios from 'axios';
import { isEmpty } from 'lodash';
import Table from './DataUseTable';
import Pagination from './DataUsePagination';
import ArchiveModal from './ArchiveModal';
import './DataUse.scss';
import SVGIcon from '../../images/SVGIcon';
import DataUseApproveModal from './modals/DataUseApproveModal';
import DataUseRejectModal from './modals/DataUseRejectModal';
import DarHelperUtil from './../../utils/DarHelper.util';

var baseURL = require('../commonComponents/BaseURL').getURL();

const DataUsePage = React.forwardRef(({ onClickDataUseUpload, team }, ref) => {
	React.useImperativeHandle(ref, () => ({
		showAlert,
	}));

	const [row, setRow] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage] = useState(40);
	const [alert, setAlert] = useState('');
	const [dataUseId, setDataUseId] = useState(-1);
	const [showApproveModal, setShowApproveModal] = useState(false);
	const [showRejectModal, setShowRejectModal] = useState(false);
	const [showArchiveModal, setShowArchiveModal] = useState(false);
	const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
	const [showSuccessBanner, setShowSuccessBanner] = useState(false);

	useEffect(() => {
		axios.get(baseURL + '/api/v2/data-use-registers?team=' + team).then(res => {
			let dataUses = res.data.data;
			dataUses.sort((dataUseOne, dataUseTwo) => Date.parse(dataUseTwo.lastActivity) - Date.parse(dataUseOne.lastActivity));
			setRow(dataUses);
		});
	}, [team, alert]);

	const onClickArchive = dataUseId => {
		toggleArchiveModal();
		setDataUseId(dataUseId);
	};

	const onClickUnarchive = dataUseId => {
		toggleUnarchiveModal();
		setDataUseId(dataUseId);
	};

	const onClickApprove = dataUseId => {
		toggleApproveModal();
		setDataUseId(dataUseId);
	};

	const onClickReject = dataUseId => {
		toggleRejectModal();
		setDataUseId(dataUseId);
	};

	const toggleApproveModal = () => {
		setShowApproveModal(!showApproveModal);
	};

	const toggleRejectModal = () => {
		setShowRejectModal(!showRejectModal);
	};

	const toggleArchiveModal = () => {
		setShowArchiveModal(!showArchiveModal);
	};

	const toggleUnarchiveModal = () => {
		setShowUnarchiveModal(!showUnarchiveModal);
	};

	const showAlert = message => {
		setAlert(message);
		setTimeout(() => {
			setAlert('');
		}, 5000);
	};

	const updataDataUseStatus = (oldStatus, newStatus, rejectionReason = '') => {
		axios.patch(baseURL + '/api/v2/data-use-registers/' + dataUseId, { activeflag: newStatus, rejectionReason }).then(res => {
			if (oldStatus === DarHelperUtil.dataUseRegisterStatus.INREVIEW && newStatus === DarHelperUtil.dataUseRegisterStatus.ACTIVE) {
				showAlert('Your data use have been successfully approved.');
				toggleApproveModal();
			} else if (oldStatus === DarHelperUtil.dataUseRegisterStatus.ARCHIVED && newStatus === DarHelperUtil.dataUseRegisterStatus.ACTIVE) {
				showAlert('Your data use have been successfully unarchived.');
				toggleUnarchiveModal();
			} else if (newStatus === DarHelperUtil.dataUseRegisterStatus.REJECTED) {
				showAlert('Your data use have been successfully rejected.');
				toggleRejectModal();
			} else if (newStatus === DarHelperUtil.dataUseRegisterStatus.ARCHIVED) {
				showAlert('Your data use have been successfully archived.');
				toggleArchiveModal();
			}
		});
	};

	const indexOfLastRow = currentPage * rowsPerPage;
	const indexOfFirstRow = indexOfLastRow - rowsPerPage;

	const tabs = ['Active', 'Pending approval', 'Rejected', 'Archived'];

	const active = row.filter(active => active.activeflag === 'active');
	const pending = row.filter(pending => pending.activeflag === 'inReview');
	const rejected = row.filter(rejected => rejected.activeflag === 'rejected');
	const archived = row.filter(archived => archived.activeflag === 'archived');

	const currentActive = active.slice(indexOfFirstRow, indexOfLastRow);
	const currentPending = pending.slice(indexOfFirstRow, indexOfLastRow);
	const currentRejected = rejected.slice(indexOfFirstRow, indexOfLastRow);
	const currentArchived = archived.slice(indexOfFirstRow, indexOfLastRow);

	const paginate = pageNumber => setCurrentPage(pageNumber);

	return (
		<Container>
			<Row>
				<Col className='pl-0 pr-0'>
					{!isEmpty(alert) && (
						<Alert variant={'success'} className='main-alert'>
							<SVGIcon name='check' width={24} height={24} fill={'#2C8267'} /> {alert}
						</Alert>
					)}

					<Alert variant='success' className='mt-3'>
						<SVGIcon width='15px' height='15px' name='tick' fill={'#165724'} /> Your edits have been saved and are now visible on the
						gateway
					</Alert>
				</Col>
			</Row>
			<Row className='datause-card mt-1'>
				<Col md={10}>
					<Row>
						<p className='black-20-semibold'>Data uses</p>
					</Row>
					<Row>
						<p className='soft-black-14 datause-para'>Manage your data use register by uploading or editing data uses.</p>
					</Row>
				</Col>
				{team !== 'user' && team !== 'admin' && (
					<Col md={2} className='datause-button-grid'>
						<Button className='button-tertiary' onClick={onClickDataUseUpload}>
							+ Upload data uses
						</Button>
					</Col>
				)}
			</Row>

			<Tabs
				defaultActiveKey={team === 'user' || (team !== 'user' && team !== 'admin') ? 'Active' : 'Pending approval'}
				className='gray700-13 data-use-tabs'>
				{tabs.map(tabName => (
					<Tab
						eventKey={tabName}
						title={
							((team === 'user' || (team !== 'user' && team !== 'admin')) &&
								tabName === 'Active' &&
								tabName + ' (' + active.length + ')') ||
							((team === 'admin' || (team !== 'user' && team !== 'admin')) &&
								tabName === 'Pending approval' &&
								tabName + ' (' + pending.length + ')') ||
							(team !== 'user' && team !== 'admin' && tabName === 'Rejected' && tabName + ' (' + rejected.length + ')') ||
							(team !== 'user' && team !== 'admin' && tabName === 'Archived' && tabName + ' (' + archived.length + ')')
						}>
						{(team === 'user' || (team !== 'user' && team !== 'admin')) && tabName === 'Active' && (
							<Table data={currentActive} active={true} team={team} onClickArchive={onClickArchive} />
						)}
						{(team === 'admin' || (team !== 'user' && team !== 'admin')) && tabName === 'Pending approval' && (
							<Table team={team} data={currentPending} pending={true} onClickApprove={onClickApprove} onClickReject={onClickReject} />
						)}
						{team !== 'user' && team !== 'admin' && tabName === 'Rejected' && <Table team={team} data={currentRejected} />}
						{team !== 'user' && team !== 'admin' && tabName === 'Archived' && (
							<Table team={team} data={currentArchived} archived={true} onClickUnarchive={onClickUnarchive} />
						)}

						<Pagination
							rowsPerPage={rowsPerPage}
							totalRows={
								tabName === 'Active'
									? active.length
									: tabName === 'Pending approval'
									? pending.length
									: tabName === 'Rejected'
									? rejected.length
									: tabName === 'Archived'
									? archived.length
									: row.length
							}
							paginate={paginate}
						/>
					</Tab>
				))}
			</Tabs>

			{showArchiveModal && (
				<ArchiveModal archive={true} onConfirm={updataDataUseStatus} isVisible={showArchiveModal} toggleModal={toggleArchiveModal} />
			)}
			{showUnarchiveModal && (
				<ArchiveModal archive={false} onConfirm={updataDataUseStatus} isVisible={showUnarchiveModal} toggleModal={toggleUnarchiveModal} />
			)}
			{showApproveModal && (
				<DataUseApproveModal onConfirm={updataDataUseStatus} isVisible={showApproveModal} toggleModal={toggleApproveModal} />
			)}
			{showRejectModal && (
				<DataUseRejectModal onConfirm={updataDataUseStatus} isVisible={showRejectModal} toggleModal={toggleRejectModal} />
			)}
		</Container>
	);
});
export default DataUsePage;
