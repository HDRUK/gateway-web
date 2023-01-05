import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { Button } from 'hdruk-react-core';
import { accountUtils } from 'utils';
import googleAnalytics from '../../../../tracking';

const MessageHeader = ({ userState, topic, modalRequired, onRequestAccess, onShowModal, is5Safes }) => {
    const [showDashboard, setShowDashboard] = useState(false);
    let [publisher, setPubliser] = useState('');
    const history = useHistory();

    const showDashboardOption = () => {
        ({ title: publisher } = topic);
        setPubliser(publisher);
        const { teams = [] } = userState;
        if (!_.isEmpty(teams)) {
            const hasPublisher = [...teams].map(t => t.name).includes(publisher);
            setShowDashboard(hasPublisher);
        } else {
            setShowDashboard(false);
        }
    };

    const onRouteChange = e => {
        e.preventDefault();
        accountUtils.updateTeamType({ teamType: 'team', teamId: publisher });
        history.push({ pathname: `/account`, search: `?tab=dataaccessrequests` });
    };

    useEffect(() => {
        showDashboardOption();
    }, [topic]);

    return (
        <>
            <div className='messageArea-header-desc'>
                <h1 className='black-20 ' data-testid='headerTitle'>
                    {topic.title}
                </h1>
                {topic.tags.map((tag, index) => (
                    <div key={`tag-${index}`} className='badge-tag' data-testid={`headerTag-${index}`}>
                        {tag.name || tag}
                    </div>
                ))}
            </div>
            <div className='messageArea-header-action'>
                {modalRequired && showDashboard ? (
                    <>
                        <div
                            className='purple-14 mr-2 pointer'
                            onClick={e => {
                                googleAnalytics.recordEvent('Data access request', 'Show applications', 'Message drawer link clicked');
                                onRouteChange(e);
                            }}>
                            Show applications
                        </div>
                        <button
                            className='button-tertiary'
                            onClick={e => {
                                googleAnalytics.recordEvent('Data access request', 'How to request access', 'Message drawer link clicked');
                                onShowModal(e);
                            }}>
                            How to request access
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className='button-tertiary'
                            onClick={e => {
                                googleAnalytics.recordEvent('Data access request', 'How to request access', 'Message drawer link clicked');
                                onShowModal(e);
                            }}>
                            How to request access
                        </button>
                        {topic.is5Safes || (topic.createdDate === 'New message' && is5Safes) ? (
                            <Button
                                variant='secondary'
                                className='ml-2'
                                onClick={e => {
                                    googleAnalytics.recordEvent('Data access request', 'Start application', 'Message drawer link clicked');
                                    onRequestAccess(e);
                                }}>
                                Start application
                            </Button>
                        ) : null}
                    </>
                )}
            </div>
        </>
    );
};

export default MessageHeader;
