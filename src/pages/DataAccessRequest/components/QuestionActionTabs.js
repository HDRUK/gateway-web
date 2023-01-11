import { useCallback, useState, useEffect, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap/';
import { capitalize, isEmpty } from 'lodash';
import { darHelperUtils } from 'utils';
import Guidance from './Guidance/Guidance';
import Messages from './Messages/Messages';
import Notes from './Notes/Notes';

const QuestionActionTabs = ({
    applicationId,
    userState,
    settings,
    activeGuidance,
    activePanelGuidance,
    resetGuidance,
    onHandleActionTabChange,
    toggleDrawer,
    setMessageDescription,
    teamType,
    isShared,
    updateCount,
    publisher,
    applicationStatus,
}) => {
    const [activeSettings, setActiveSettings] = useState({ key: '', questionSetId: '', questionId: '' });
    const [messagesCount, setMessagesCount] = useState(0);
    const [notesCount, setNotesCount] = useState(0);

    const onHandleSelect = key => {
        onHandleActionTabChange({ ...activeSettings, key });
    };

    const hasSettings = () => {
        return !isEmpty(activeSettings.questionId) || (!!activePanelGuidance && activeSettings?.panel?.panelId);
    };

    const handleMessagesLoad = ({ data: { messages } }) => {
        setMessagesCount(messages.length);
    };

    const handleNotesLoad = ({ data: { messages } }) => {
        setNotesCount(messages.length);
    };

    const handleUpdateMessagesCount = useCallback(
        (questionId, questionSetId, type) => {
            setMessagesCount(messagesCount + 1);

            updateCount(questionId, questionSetId, type);
        },
        [messagesCount]
    );

    const handleUpdateNotesCount = useCallback(
        (questionId, questionSetId, type) => {
            setNotesCount(notesCount + 1);

            updateCount(questionId, questionSetId, type);
        },
        [notesCount]
    );

    useEffect(() => {
        if (!isEmpty(settings)) {
            if (settings.key === '') settings.key = darHelperUtils.actionKeys.GUIDANCE;
            setActiveSettings(settings);
        }
    }, [settings]);

    useEffect(() => {
        setMessagesCount(0);
        setNotesCount(0);
    }, [settings.panel, settings.questionId]);

    return (
        <div>
            <Tabs activeKey={activeSettings.key} onSelect={onHandleSelect} className='action-tabs'>
                <Tab
                    eventKey={darHelperUtils.actionKeys.GUIDANCE}
                    title={
                        <>
                            <i
                                className={`far fa-question-circle mr-2 ${
                                    activeSettings.key === darHelperUtils.actionKeys.GUIDANCE ? 'tab-is-active' : ''
                                }`}
                            />
                            {capitalize(darHelperUtils.actionKeys.GUIDANCE)}
                        </>
                    }>
                    {!!activePanelGuidance || !isEmpty(activeSettings.questionId) ? (
                        <Guidance activeGuidance={activeGuidance || activePanelGuidance} />
                    ) : (
                        <div className='darTab-guidance'>Click on a question guidance to view details</div>
                    )}
                </Tab>
                <Tab
                    eventKey={darHelperUtils.actionKeys.MESSAGES}
                    title={
                        <>
                            <i
                                className={`far fa-comment-alt mr-2 ${
                                    activeSettings.key === darHelperUtils.actionKeys.MESSAGES ? 'tab-is-active' : ''
                                }`}
                            />
                            {capitalize(darHelperUtils.actionKeys.MESSAGES)}
                            {hasSettings() && messagesCount > 0 ? <span className='tab-count'>{messagesCount}</span> : ''}
                        </>
                    }>
                    {hasSettings() ? (
                        <Messages
                            applicationId={applicationId}
                            userState={userState}
                            settings={settings}
                            applicationShared={isShared}
                            applicationStatus={applicationStatus}
                            toggleDrawer={toggleDrawer}
                            setMessageDescription={setMessageDescription}
                            teamType={teamType}
                            updateCount={handleUpdateMessagesCount}
                            publisher={publisher}
                            onLoad={handleMessagesLoad}
                            count={messagesCount}
                        />
                    ) : (
                        <div className='darTab-guidance'>Click on a question message to view messages</div>
                    )}
                </Tab>

                <Tab
                    eventKey={darHelperUtils.actionKeys.NOTES}
                    title={
                        <>
                            <i
                                className={`far fa-edit mr-2 ${
                                    activeSettings.key === darHelperUtils.actionKeys.NOTES ? 'tab-is-active' : ''
                                }`}
                            />
                            {capitalize(darHelperUtils.actionKeys.NOTES)}
                            {hasSettings() && notesCount > 0 ? <span className='tab-count'>{notesCount}</span> : ''}
                        </>
                    }>
                    {hasSettings() ? (
                        <Notes
                            applicationId={applicationId}
                            userState={userState}
                            settings={settings}
                            teamType={teamType}
                            updateCount={handleUpdateNotesCount}
                            onLoad={handleNotesLoad}
                            count={notesCount}
                        />
                    ) : (
                        <div className='darTab-guidance'>Click on a question note to view notes</div>
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};

export default QuestionActionTabs;
