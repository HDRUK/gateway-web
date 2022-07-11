import React, { Fragment, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { isEmpty, isBoolean } from 'lodash';
import { onLoad } from '@sentry/react';
import TextareaAutosize from 'react-textarea-autosize';
import ShareFormModal from './ShareFormModal';
import Loading from '../../../commonComponents/Loading';
import './Messages.scss';
import { baseURL } from '../../../../configs/url.config';
import DarHelper from '../../../../utils/DarHelper.util';
import Button from '../../../../components/Button';
import Textarea from '../../../../components/Textarea/Textarea';
import LayoutBox from '../../../../components/LayoutBox';

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
    onLoad,
    count,
}) => {
    const [showShareFormModal, setShowShareFormModal] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageThread, setMessageThread] = useState([]);
    const [applicationIsShared, setApplicationIsShared] = useState(applicationShared);
    const [isloading, setIsloading] = useState(true);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(false);

    const messagesEndRef = useRef(null);

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
        setCurrentMessage('');

        toggleDrawer();
    };

    const messageAndShare = async () => {
        await axios.put(`${baseURL}/api/v1/data-access-request/${applicationId}/share`);

        setApplicationIsShared(true);
        setShowShareFormModal(false);

        sendMessage(currentMessage);
    };

    const sendMessage = async message => {
        setSendButtonDisabled(true);

        // TODO: Post message to API
        const { questionId, questionSetId, panel } = settings;

        await axios.post(`${baseURL}/api/v1/data-access-request/${applicationId}/messages`, {
            questionId,
            panel,
            messageType: 'DAR_Message',
            messageBody: message,
        });

        setMessageThread([
            ...messageThread,
            { name: userState[0].name, date: moment(Date.now()).format('D MMM YYYY HH:mm'), content: currentMessage, userType },
        ]);

        setCurrentMessage('');
        setSendButtonDisabled(false);
        updateCount(questionId, questionSetId || panel.panelId, 'message');
    };

    const retrieveMessageThread = async () => {
        const { questionId, panel } = settings;

        const response = await axios.get(
            `${baseURL}/api/v1/data-access-request/${applicationId}/messages?messageType=DAR_Message&${
                questionId ? `questionId=${questionId}` : `panelId=${panel.panelId}`
            }`
        );

        onLoad(response);

        setIsloading(false);
        setMessageThread(response.data.messages);
    };

    const buildMessageThread = () => {
        if (isEmpty(messageThread) && messageThread.length < 1) {
            return (
                <>
                    <div className='info-msg no-messages'>
                        Use messages to clarify questions regarding certain parts of the application. The custodian will receive an email.{' '}
                        <br />
                        <br />
                        There are no messages relating to this question.
                    </div>
                </>
            );
        }
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
    };

    const handleChangeMessage = ({ target: { value } }) => {
        setCurrentMessage(value);
    };

    return (
        <>
            <div className='info-msg'>Both data custodian and applicants can see messages</div>
            <div className='darTab-messages'>
                <div className='messages'>
                    {isloading ? (
                        <>
                            <Loading />
                        </>
                    ) : (
                        buildMessageThread()
                    )}

                    <div ref={messagesEndRef} id='messageEndRef' />
                </div>
            </div>
            <LayoutBox
                p={3}
                display='flex'
                as='form'
                onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage(currentMessage);
                }}>
                <LayoutBox flexGrow='1'>
                    <Textarea autosize value={currentMessage} onChange={handleChangeMessage} mb={0} width='100%' minHeight='42px' />
                </LayoutBox>
                <Button variant='secondary' type='submit' disabled={sendButtonDisabled} ml={2}>
                    Send
                </Button>
            </LayoutBox>
            {showShareFormModal && (
                <ShareFormModal
                    open={showShareFormModal}
                    close={onShowShareFormModal}
                    messageWithoutSharing={messageWithoutSharing}
                    messageAndShare={messageAndShare}
                />
            )}
        </>
    );
};

export default Messages;
