import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { isEmpty, isBoolean } from 'lodash';
import ShareFormModal from './ShareFormModal';
import Loading from '../../../commonComponents/Loading';
import './Messages.scss';
import { baseURL } from '../../../../configs/url.config';
import DarHelper from '../../../../utils/DarHelper.util';

const Messages = ({
	applicationId,
	settings,
	applicationShared = false,
	applicationStatus,
	toggleDrawer,
	setMessageDescription,
	userState,
	userType,
	updateCount,
	publisher,
}) => {
	const [showShareFormModal, setShowShareFormModal] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [messageThread, setMessageThread] = useState([]);
	const [applicationIsShared, setApplicationIsShared] = useState(applicationShared);
	const [isloading, setIsloading] = useState(true);

	const messagesEndRef = useRef(null);
	let btnRef = useRef();

	useEffect(() => {
		setIsloading(true);
		retrieveMessageThread();
	}, [settings]);

	useEffect(() => {
		scrollToBottom();
	}, [messageThread]);

	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
	};

	const onShowShareFormModal = () => {
		setShowShareFormModal(!showShareFormModal);
	};

	const handleSendMessage = message => {
		if (!message) {
			return;
		}
		if ((!isBoolean(applicationIsShared) || !applicationIsShared) && applicationStatus === DarHelper.darStatus.inProgress) {
			onShowShareFormModal();
		} else {
			sendMessage(message);
		}
	};

	const messageWithoutSharing = () => {
		setShowShareFormModal(false);
		setMessageDescription(currentMessage);
		toggleDrawer();
		setCurrentMessage('');
	};

	const messageAndShare = async () => {
		await axios.put(`${baseURL}/api/v1/data-access-request/${applicationId}/share`);
		setApplicationIsShared(true);
		setShowShareFormModal(false);
		sendMessage(currentMessage);
	};

	const sendMessage = async message => {
		if (btnRef.current) {
			btnRef.current.setAttribute('disabled', 'disabled');
		}
		// TODO: Post message to API
		const { questionId, questionSetId } = settings;
		await axios.post(`${baseURL}/api/v1/data-access-request/${applicationId}/messages`, {
			questionId,
			messageType: 'DAR_Message',
			messageBody: message,
		});

		setMessageThread([
			...messageThread,
			{ name: userState[0].name, date: moment(Date.now()).format('D MMM YYYY HH:mm'), content: currentMessage, userType: userType },
		]);
		setCurrentMessage('');
		if (btnRef.current) {
			btnRef.current.removeAttribute('disabled');
		}
		updateCount(questionId, questionSetId, 'message');
	};

	const retrieveMessageThread = async () => {
		// 1. api call to get messages
		const { questionId } = settings;
		const response = await axios.get(
			`${baseURL}/api/v1/data-access-request/${applicationId}/messages?messageType=DAR_Message&questionId=${questionId}`
		);
		setIsloading(false);
		setMessageThread(response.data.messages);
	};

	const buildMessageThread = () => {
		if (isEmpty(messageThread) && messageThread.length < 1) {
			return (
				<Fragment>
					<div className='info-msg no-messages'>
						Use messages to clarify questions regarding certain parts of the application. The custodian will receive an email. <br />
						<br />
						There are no messages relating to this question.
					</div>
				</Fragment>
			);
		} else {
			// Map over messages and return each as a bubble styled depending on who sent it
			return messageThread.map(msg => {
				return (
					<div className={userType.toUpperCase() === msg.userType.toUpperCase() ? 'message-sent' : 'message-received'}>
						<div
							className={`${
								userType.toUpperCase() === msg.userType.toUpperCase() ? 'message-bubble-sent' : 'message-bubble-received'
							} message-bubble`}>
							<div className='message-metadata'>
								<span>
									{msg.name}
									{msg.userType === 'custodian' ? <>{publisher ? ` (${publisher})` : ''}</> : ''}
								</span>
								&nbsp;
								<span>{msg.date}</span>
							</div>
							{msg.content}
						</div>
					</div>
				);
			});
		}
	};

	return (
		<Fragment>
			<div className='info-msg'>Both data custodian and applicants can see messages</div>
			<div className='darTab-messages'>
				<div className='messages'>
					{isloading ? (
						<Fragment>
							<Loading />
						</Fragment>
					) : (
						buildMessageThread()
					)}

					<div ref={messagesEndRef} id='messageEndRef'></div>
				</div>
			</div>
			<form
				className='messages-form'
				onSubmit={e => {
					e.preventDefault();
					handleSendMessage(currentMessage);
				}}>
				<div className='messages-textarea'>
					<textarea
						className='form-control messages-textarea2'
						type='text'
						value={currentMessage}
						name='name'
						onChange={e => {
							e.preventDefault();
							setCurrentMessage(e.target.value);
						}}
					/>
				</div>
				<button ref={btnRef} className='button-secondary messages-button' type='submit'>
					Send
				</button>
			</form>
			{showShareFormModal ? (
				<ShareFormModal
					open={showShareFormModal}
					close={onShowShareFormModal}
					messageWithoutSharing={messageWithoutSharing}
					messageAndShare={messageAndShare}
				/>
			) : (
				''
			)}
		</Fragment>
	);
};

export default Messages;
