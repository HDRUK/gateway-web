import { useState, useEffect, Fragment } from 'react';
import { Tabs, Tab } from 'react-bootstrap/';
import { darHelperUtils } from 'utils';
import { capitalize, isEmpty } from 'lodash';
import Guidance from './Guidance/Guidance';
import Messages from './Messages/Messages';
import Notes from './Notes/Notes';

const QuestionActionTabs = ({
    applicationId,
    userState,
    settings,
    activeGuidance,
    resetGuidance,
    onHandleActionTabChange,
    toggleDrawer,
    setMessageDescription,
    teamType,
    messagesCount,
    notesCount,
    isShared,
    updateCount,
    publisher,
    applicationStatus,
}) => {
    const [activeSettings, setActiveSettings] = useState({ key: '', questionSetId: '', questionId: '' });

    const onHandleSelect = key => {
        onHandleActionTabChange({ ...activeSettings, key });
    };

    useEffect(() => {
        if (!isEmpty(settings)) {
            if (settings.key === '') settings.key = darHelperUtils.actionKeys.GUIDANCE;
            setActiveSettings(settings);
        }
    }, [settings]);

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
                    {!isEmpty(activeSettings.questionId) ? (
                        <Guidance activeGuidance={activeGuidance} />
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
                            {!isEmpty(activeSettings.questionId) && messagesCount > 0 ? (
                                <span className='tab-count'>{messagesCount}</span>
                            ) : (
                                ''
                            )}
                        </>
                    }>
                    {activeSettings.key === darHelperUtils.actionKeys.MESSAGES ? (
                        <>
                            {!isEmpty(activeSettings.questionId) ? (
                                <Messages
                                    applicationId={applicationId}
                                    userState={userState}
                                    settings={settings}
                                    applicationShared={isShared}
                                    applicationStatus={applicationStatus}
                                    toggleDrawer={toggleDrawer}
                                    setMessageDescription={setMessageDescription}
                                    teamType={teamType}
                                    updateCount={updateCount}
                                    publisher={publisher}
                                />
                            ) : (
                                <div className='darTab-guidance'>Click on a question message to view messages</div>
                            )}
                        </>
                    ) : (
                        ''
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
                            {!isEmpty(activeSettings.questionId) && notesCount > 0 ? <span className='tab-count'>{notesCount}</span> : ''}
                        </>
                    }>
                    {activeSettings.key === darHelperUtils.actionKeys.NOTES ? (
                        <>
                            {!isEmpty(activeSettings.questionId) ? (
                                <Notes
                                    applicationId={applicationId}
                                    userState={userState}
                                    settings={settings}
                                    teamType={teamType}
                                    updateCount={updateCount}
                                />
                            ) : (
                                <div className='darTab-guidance'>Click on a question note to view notes</div>
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </Tab>
            </Tabs>
        </div>
    );
};

export default QuestionActionTabs;
