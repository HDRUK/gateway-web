import React, { useState, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import axios from 'axios';
import _ from 'lodash';
import { baseURL } from '../../../configs/url.config';
import TopicList from './components/TopicList';
import MessageHeader from './components/MessageHeader';
import MessageItem from './components/MessageItem';
import MessageFooter from './components/MessageFooter';
import './UserMessages.scss';

const UserMessages = ({ userState, topicContext, closed, toggleModal, drawerIsOpen = false }) => {
	const defaultMessage =
		'Use messages to clarify questions with the data custodian before starting your application to request access to the data. Provide a brief description of your project and what datasets you are interested in.';

	let relatedObjectIds, title, subTitle, datasets, tags, allowNewMessage, requiresModal, dataRequestModalContent;

	let history = useHistory();

	if (typeof topicContext !== 'undefined')
		({
			relatedObjectIds = [],
			title = '',
			subTitle = '',
			datasets = [],
			tags = [],
			allowNewMessage = false,
			requiresModal = false,
			dataRequestModalContent = {},
		} = topicContext);

	const [messageDescription, setMessageDescription] = useState('');

	const [topics, setTopics] = useState([]);

	const [activeTopic, setActiveTopic] = useState({});

	const [textArea, resetTextArea] = useState('');

	const [modalRequired, setRequiresModal] = useState(requiresModal);

	/**
	 * GetUserTopics
	 * @param null
	 * @desc Gets topics from API, set inital state and active state
	 * @returns [{Object}] topics
	 */
	const getUserTopics = async () => {
		await axios
			.get(`${baseURL}/api/v1/topics`)
			.then(async res => {
				const {
					data: { topics },
				} = res;
				// 1. clone topics from t
				let topicsArr = [...topics];
				// 2. check if  dataset id has been passed
				if (_.isEmpty(datasets) && !_.isEmpty(topicsArr)) {
					const initialTopic = topicsArr[0];
					topicsArr[0].active = true;
					await getTopicById(initialTopic._id);
					setTopics(topicsArr);
					return;
				}
				// 3. check if existing relatedObjectIds already in topic arr
				const existingTopicIdx = checkTopicExists(topicsArr, relatedObjectIds);
				// 4. if topics exists
				if (existingTopicIdx > -1) {
					// 4a. get topic in arr
					const activeTopic = topicsArr[existingTopicIdx];
					// 4b. get full topic including messages set active topic
					await getTopicById(activeTopic._id);
					// 4c. set active state on topics arr
					topicsArr[existingTopicIdx].active = true;
				} else if (allowNewMessage) {
					// 5. if new topic make new object
					const newTopic = setNewTopic();
					// 6. only push new topic in if not empty
					if (!_.isEmpty(newTopic)) {
						topicsArr.unshift(newTopic);
						setActiveTopic(newTopic);
					}
				} else if (!allowNewMessage) {
					// Clear message header/body
					setActiveTopic({});
				}
				// 7. set topics state
				setTopics(topicsArr);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const setNewTopic = () => {
		if (typeof relatedObjectIds !== 'undefined') {
			let topic = {
				_id: '',
				title,
				subTitle,
				tags,
				recipients: [],
				status: 'active',
				isDeleted: false,
				relatedObjectIds,
				createdDate: 'New message',
				active: true,
				topicMessages: [],
				requiresModal,
				dataRequestModalContent,
				datasets,
			};
			return topic;
		}
		return {};
	};

	const checkTopicExists = (topics = [], relatedObjectIds = []) => {
		// 1. Check that a valid set of params have been passed
		if (!_.isEmpty(topics) && !_.isEmpty(relatedObjectIds)) {
			// 2. Find the index of a topic that contains each of the relatedObjectIds
			const idx = topics.findIndex(t => relatedObjectIds.every(id => t.relatedObjectIds.includes(id)));
			// 3. Return the index for selection otherwise return -1 and create new topic to cover all objects
			return idx;
		}
		return -1;
	};

	const onCloseDrawer = () => {
		closed();
	};

	/**
	 * Topic Click
	 * @param id {ObjectId}
	 * @desc When a topic is clicked add active flag true for selected topic
	 * @returns [{Object}] topics
	 */
	const onTopicClick = (id = '') => {
		// 1. loop over topics and set active state to the id
		const generatedTopics = [...topics].reduce((arr, item) => {
			let topic = {
				...item,
				active: item._id === id,
			};
			// setActiveTopic if active
			if (topic.active) {
				// go get topic by id and set activeTopic
				getTopicById(topic._id);
			}
			return [...arr, topic];
		}, []);
		// 2. set state
		setTopics(generatedTopics);
		// 3. reset textArea
		setMessageDescription('');
	};

	/**
	 * getTopicById
	 * @param topic {<ObjectId>}
	 * @desc Returns the full topic including messages for selected topic
	 * @returns Sets state for active topic
	 */
	const getTopicById = async (id = '') => {
		// 1. Check if this is an existing topic denoted by populated id
		if (!_.isEmpty(id)) {
			// 2. Load full topic details from Db
			await axios
				.get(`${baseURL}/api/v1/topics/${id}`)
				.then(async res => {
					let dataRequestModalContent = {};
					let {
						data: { topic },
					} = res;
					let { datasets: [publisherObj = {}, ...rest] = [] } = topic;
					const {
						data: { publisher = {} },
					} = await getPublisherById(publisherObj.publisher);
					if (!_.isEmpty(publisher)) {
						({ dataRequestModalContent } = publisher);
						setRequiresModal(!_.isEmpty(dataRequestModalContent) ? true : false);
					}
					// 3. Set active topic to update messages pane
					setActiveTopic({ ...topic, modalRequired, dataRequestModalContent, active: true });
				})
				.catch(err => {
					console.error(err);
					return {};
				});
		} else {
			// 2. Otherwise it is a new topic so find topic with empty id in topic list
			let topic = topics.find(t => t._id === '');
			// 3. Check new topic was found
			if (!topic) {
				console.error('An error occurred selecting the topic');
				return {};
			}
			// 4. Set active topic to update messages pane
			setActiveTopic({ ...topic, active: true });
		}
	};

	const getPublisherById = (publisherId = '') => {
		if (!_.isEmpty(publisherId)) {
			const response = axios.get(`${baseURL}/api/v1/publishers/${publisherId}`);
			return response;
		}
		return {};
	};

	/**
	 * Request Access
	 * @param topic {ObjectId}
	 * @desc When a user clicks Request Access button in header
	 */
	const onRequestAccess = e => {
		e.preventDefault();
		//let id = '';
		if (!_.isEmpty(activeTopic)) {
			// remove scroll if in body
			if (document.body.classList.contains('no-scroll')) document.body.classList.remove('no-scroll');
			let { datasets } = { ...activeTopic };
			closed();
			const { publisher } = datasets[0];
			history.push({ pathname: `/data-access-request/publisher/${publisher}` }, { datasets });
		}
	};

	const onShowModal = e => {
		e.preventDefault();
		closed();
		toggleModal(false, activeTopic);
	};

	/**
	 * onMessageChange
	 * @param event {<Object>}
	 * @desc Event to set message description text
	 */
	const onMessageChange = e => {
		e.preventDefault();
		setMessageDescription(e.target.value);
	};

	/**
	 * onSubmitMessage
	 * @param event {<Object>}
	 * @desc Event to Post message to db
	 */
	const onSubmitMessage = e => {
		e.preventDefault();
		if (_.isEmpty(messageDescription)) return false;

		let params = {
			messageType: 'message',
			topic: activeTopic._id,
			relatedObjectIds: activeTopic.relatedObjectIds,
			messageDescription,
		};
		// do post here
		axios
			.post(`${baseURL}/api/v1/messages`, params)
			.then(response => {
				// 1. set textarea to be blank
				setMessageDescription('');
				// 2. deconstruct message obj
				const {
					data: {
						message: { messageDescription, createdDate, createdByName, _id, topic },
					},
				} = response;
				// 3. copy new message
				let newTopic = { ...activeTopic };
				// 4. check here if new topic has been saved - key 'new'
				if (_.isEmpty(newTopic._id)) {
					// 4a. update newTopic date and _id
					newTopic['createdDate'] = createdDate;
					newTopic._id = topic;
					// 4b. update the main topics arr with the updated topic info
					let topicsArr = [...topics];
					topicsArr[0].createdDate = createdDate;
					topicsArr[0]._id = topic;
					// 4c. set topics state
					setTopics(topicsArr);
				}
				// 5. add new data into topic message
				newTopic.topicMessages.unshift({
					_id,
					messageDescription,
					createdDate,
					createdBy: createdByName,
				});
				// 6. set the active topic
				setActiveTopic(newTopic);
			})
			.catch(err => {
				console.log(err);
			});
	};

	useEffect(() => {
		// 1. GET Topics for current user
		if (drawerIsOpen) getUserTopics();
	}, [drawerIsOpen, topicContext]);

	return (
		<Fragment>
			<div className='sideDrawer-header'>
				<div>Messages</div>
				<CloseButtonSvg className='sideDrawer-header--close' onClick={() => onCloseDrawer()} />
			</div>
			{topics.length > 0 ? (
				<div className='sideDrawer-body'>
					<TopicList topics={topics} onTopicClick={onTopicClick} />
					<div className='messageArea'>
						<div className='messageArea-header'>
							{!_.isEmpty(activeTopic) ? (
								<MessageHeader
									userState={userState}
									topic={activeTopic}
									modalRequired={modalRequired}
									onRequestAccess={onRequestAccess}
									onShowModal={onShowModal}
								/>
							) : (
								''
							)}
						</div>
						<div className='messageArea-body'>
							{!_.isEmpty(activeTopic.topicMessages)
								? activeTopic.topicMessages.map(message => <MessageItem key={message._id} {...message} />)
								: ''}
						</div>
						<div className='messageArea-footer'>
							{!_.isEmpty(activeTopic) ? (
								<MessageFooter value={messageDescription} onSubmitMessage={onSubmitMessage} onMessageChange={onMessageChange} />
							) : (
								''
							)}
						</div>
					</div>
				</div>
			) : (
				<div className='sideDrawer-noMessages'>
					<div>No messages yet</div>
					<div>
						Use messages to clarify questions with the data custodian before statring your application to request access to the data. Select
						a dataset and make an enquiry.
					</div>
				</div>
			)}
		</Fragment>
	);
};

export default UserMessages;

UserMessages.defaultProps = {
	closed: () => {},
	toggleModal: () => {},
	topicContext: undefined,
	drawerIsOpen: false,
};
