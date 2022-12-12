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
import { EnquiryMessage } from './components/EnquiryMessage';
import './UserMessages.scss';
import googleAnalytics from '../../../tracking';

const UserMessages = ({ userState, topicContext, closed, toggleModal, drawerIsOpen = false, is5Safes, msgDescription }) => {
    let relatedObjectIds, title, subTitle, datasets, allowNewMessage, requiresModal, dataRequestModalContent;

    let history = useHistory();

    if (typeof topicContext !== 'undefined')
        ({
            relatedObjectIds = [],
            title = '',
            subTitle = '',
            datasets = [],
            allowNewMessage = false,
            requiresModal = false,
            dataRequestModalContent = {},
        } = topicContext);

    const [messageDescription, setMessageDescription] = useState(msgDescription);

    const [topics, setTopics] = useState([]);
    const [activeTopic, setActiveTopic] = useState({});
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
                // 1. clone topics
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
            .catch(err => {
                console.error(err.message);
            });
    };

    const setNewTopic = () => {
        if (typeof relatedObjectIds !== 'undefined') {
            let topic = {
                _id: '',
                title,
                subTitle,
                tags: [{ _id: relatedObjectIds[0], name: subTitle, publisher: datasets[0].publisher }],
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
        googleAnalytics.recordEvent('User message drawer', 'Closed drawer', 'Clicked close modal');
        closed();
    };

    /**
     * Topic Click
     * @param id {ObjectId}
     * @desc When a topic is clicked add active flag true for selected topic
     * @returns [{Object}] topics
     */
    const onTopicClick = (id = '') => {
        googleAnalytics.recordEvent('User message drawer', 'Viewed message thread', 'Clicked message thread');
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
                    console.error(err.message);
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

    const postMessage = params => {
        axios
            .post(`${baseURL}/api/v1/messages`, params)
            .then(response => {
                // 1. set textarea to be blank
                setMessageDescription('');
                // 2. deconstruct message obj
                const {
                    data: {
                        messageObj: { messageDescription, createdDate, createdByName, _id, topic, firstMessage },
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
                    firstMessage,
                });
                // 6. set the active topic
                setActiveTopic(newTopic);
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    /**
     * onSubmitMessage
     * @param event {<Object>}
     * @desc Event to Post message to db
     */
    const onSubmitMessage = e => {
        e.preventDefault();
        if (_.isEmpty(messageDescription)) return false;

        googleAnalytics.recordEvent('Data access request', 'Message sent', 'Message drawer submit clicked');
        let params = {
            messageType: 'message',
            topic: activeTopic._id,
            relatedObjectIds: activeTopic.relatedObjectIds,
            messageDescription,
        };

        postMessage(params);
    };

    const isNewMessage = (activeTopic = {}) => {
        if (!_.isEmpty(activeTopic)) {
            // deconstruct createdData
            let { createdDate = '' } = activeTopic;
            return createdDate.trim().toUpperCase() === 'NEW MESSAGE' ? true : false;
        }
        return false;
    };

    /**
     * onDatasetsRequested
     *
     * @description - Callback function to handle selection of datasets from first message
     * @param   {[Array]}  datasets  [A list of datasets selected from typeahead]
     */
    const onDatasetsRequested = datasets => {
        setActiveTopic({ ...activeTopic, tags: [...datasets] });
    };

    /**
     * onFirstMessageSubmit
     */
    const onFirstMessageSubmit = data => {
        googleAnalytics.recordEvent('Data access request', 'First message sent', 'Message drawer submit clicked');
        let params = {
            messageType: 'message',
            topic: activeTopic._id,
            relatedObjectIds: getRelatedObjectIds(activeTopic.tags),
            messageDescription: data.messageDescription,
            firstMessage: data.firstMessage,
        };

        postMessage(params);
    };

    const getRelatedObjectIds = activeTopicTags => {
        let tempRelatedObjectIds = [];
        activeTopicTags.map(tag => tempRelatedObjectIds.push(tag._id));

        return tempRelatedObjectIds;
    };

    useEffect(() => {
        // 1. GET Topics for current user
        if (drawerIsOpen) {
            googleAnalytics.recordVirtualPageView('Message drawer open');
            getUserTopics();
        }
    }, [drawerIsOpen, topicContext]);

    useEffect(() => {
        setMessageDescription(msgDescription);
    }, [msgDescription]);

    return (
        <Fragment>
            <div className='sideDrawer-header'>
                <div>Messages</div>
                <CloseButtonSvg className='sideDrawer-header--close' onClick={() => onCloseDrawer()} />
            </div>
            {topics.length > 0 ? (
                <div className='sideDrawer-body'>
                    <TopicList topics={topics} onTopicClick={onTopicClick} />
                    <div
                        className='messageArea'
                        style={{ gridTemplateRows: `${isNewMessage(activeTopic) ? '1fr 10fr' : '1fr 10fr 170px'}` }}
                    >
                        <div className='messageArea-header'>
                            {!_.isEmpty(activeTopic) ? (
                                <MessageHeader
                                    userState={userState}
                                    topic={activeTopic}
                                    modalRequired={modalRequired}
                                    onRequestAccess={onRequestAccess}
                                    onShowModal={onShowModal}
                                    is5Safes={is5Safes}
                                />
                            ) : (
                                ''
                            )}
                        </div>

                        <div className='messageArea-body'>
                            {!_.isEmpty(activeTopic.topicMessages) ? (
                                activeTopic.topicMessages.map(message => <MessageItem key={message._id} {...message} />)
                            ) : !_.isEmpty(activeTopic) && isNewMessage(activeTopic) ? (
                                <EnquiryMessage
                                    topic={activeTopic}
                                    onDatasetsRequested={onDatasetsRequested}
                                    onFirstMessageSubmit={onFirstMessageSubmit}
                                />
                            ) : (
                                ''
                            )}
                        </div>

                        {/* DONT SHOW FOOTER IF A NEW MESSAGE - EXTEND BODY */}
                        {!_.isEmpty(activeTopic) && !isNewMessage(activeTopic) ? (
                            <div className='messageArea-footer'>
                                <MessageFooter
                                    value={messageDescription}
                                    onSubmitMessage={onSubmitMessage}
                                    onMessageChange={onMessageChange}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            ) : (
                <div className='sideDrawer-noMessages'>
                    <div>No messages yet</div>
                    <div>
                        Use messages to clarify questions with the data custodian before statring your application to request access to the
                        data. Select a dataset and make an enquiry.
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
