import React, { Fragment, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import ReactMarkdown from 'react-markdown';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import { Event } from '../../../tracking';
import DataSetHelper from '../../../utils/DataSetHelper.util';

import './DataSetModal.scss';

const DataSetModal = ({ open, closed, context, userState }) => {
	let datasets = [],
		title = '',
		contactPoint = '',
		dataRequestModalContent = { header: '', body: '' },
		showActionButtons;

	const { loggedIn: isLoggedIn } = userState;
	const [screenData, setScreenData] = useState({});

	let history = useHistory();

	const initScreenData = () => {
		if (typeof context !== 'undefined' && !_.isEmpty(context) && !_.isEmpty(context.datasets)) {
			({ datasets, title, contactPoint, dataRequestModalContent, showActionButtons = true } = context);
			setScreenData({ datasets, title, contactPoint, dataRequestModalContent, showActionButtons });
		}
	};

	const onRequestAccess = e => {
		// 1. stop default click
		e.preventDefault();
		// 2. close modal and do not show enquiry - false
		closed(false);
		// 3. check user loggedIn status if not make user login
		if (!isLoggedIn) {
			// 3a. Show the loginPanel
			DataSetHelper.showLoginPanel(window, title);
		} else {
			// 3. log google analytics event (Category-Action-Label)
			Event('Buttons', 'Click', 'Request Access');
			// 4. redirect to access request
			const { publisher } = context.datasets[0];
			history.push({ pathname: `/data-access-request/publisher/${publisher}` }, { datasets: context.datasets });
		}
	};

	const onCloseModal = (showEnquiry = false) => {
		// 1. if user is not loggedIn and wants to make enquiry make them sign in
		if (!isLoggedIn && showEnquiry) {
			// 2. close modal and do not show enquiry - false;
			closed(false);
			// 3. Show the loginPanel
			DataSetHelper.showLoginPanel(window, title);
		} else {
			// 4. do normal operation
			closed(showEnquiry);
		}
	};

	useEffect(() => {
		if (open) initScreenData();
	}, [open, context]);

	return (
		<Fragment>
			<Modal show={open} onHide={closed} size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
				<div className='appModal-header'>
					<div className='appModal-header--wrap'>
						<div className='appModal-head'>
							<h1 className='black-20-semibold'>Data access requests</h1>
							<CloseButtonSvg className='appModal-head--close' onClick={() => onCloseModal(false)} />
						</div>
						{!_.isEmpty(screenData.dataRequestModalContent) && typeof screenData.dataRequestModalContent.header !== 'undefined' ? (
							<ReactMarkdown source={screenData.dataRequestModalContent.header} />
						) : (
							''
						)}
					</div>
				</div>

				<div className='appModal-body'>
					{!_.isEmpty(screenData.dataRequestModalContent) && typeof screenData.dataRequestModalContent.body !== 'undefined' ? (
						<ReactMarkdown source={screenData.dataRequestModalContent.body} />
					) : (
						''
					)}
				</div>

				<div className='appModal-footer'>
					{screenData.showActionButtons ? (
						<div className='appModal-footer--wrap'>
							<button className='button-secondary mr-2' onClick={e => onRequestAccess(e)}>
								Request access
							</button>
							<button className='btn btn-primary addButton' onClick={() => onCloseModal(true)}>
								Send a message to the custodian
							</button>
						</div>
					) : null}
				</div>
			</Modal>
		</Fragment>
	);
};

DataSetModal.defaultProps = {
	closed: () => {},
	context: {},
	userState: {},
	open: false,
};

export default DataSetModal;
