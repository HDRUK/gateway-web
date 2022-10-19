import React from 'react';
import { Alert, LayoutContent } from 'components';
import { Tabs, Tab } from 'react-bootstrap';
import { isEmpty, upperFirst } from 'lodash';
import { ACCOUNT_TAB_TYPES } from 'consts';
import { AccountTeamFieldRepeater, AccountTeamGatewayNotificationEmails, AccountTeamGatewayEmail } from 'modules';
import PropTypes from 'prop-types';
import { userStateType, teamGatewayNotificationsType } from 'types';
import { Card, H5, P, Box } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import { isAdminNotManager } from 'utils/auth';
import Loading from '../commonComponents/Loading';

const EmailNotificationsHeader = () => {
    const { t } = useTranslation();
    return (
        <Card data-testid='EmailNotificationsHeader' style={{ padding: '30px 20px' }}>
            <H5 mb={2}>{t('pages.AccountTeamManagement.emailNotificationsTitle')}</H5>
            <P color='grey700'>{t('pages.AccountTeamManagement.emailNotificationsDescription')}</P>
        </Card>
    );
};
const LoaderRow = () => (
    <LayoutContent data-testid='LoaderRow'>
        <Loading />
    </LayoutContent>
);

const TeamManagementHeader = () => {
    const { t } = useTranslation();
    return (
        <Card data-testid='TeamManagementHeader' style={{ padding: '30px 20px' }}>
            <H5 mb={2}>{t('pages.AccountTeamManagement.title')}</H5>
            <P color='grey700'>
                {t('pages.AccountTeamManagement.description')}{' '}
                <a href='https://hdruk.atlassian.net/servicedesk/customer/portal/1'>{t('pages.AccountTeamManagement.supportLinkText')}</a>.
            </P>
        </Card>
    );
};

const TabsNav = ({ activeTabKey, onTabChange, teamId, userState }) => {
    //  TODO: GAT-1510:020
    if (isAdminNotManager(teamId, userState)) return null;

    return (
        <Card data-testid='TabsNav'>
            <Tabs activeKey={activeTabKey} onSelect={onTabChange}>
                {Object.keys(ACCOUNT_TAB_TYPES).map(keyName => (
                    <Tab
                        key={keyName}
                        eventKey={`${ACCOUNT_TAB_TYPES[keyName]}`}
                        title={<P>{upperFirst(ACCOUNT_TAB_TYPES[keyName])}</P>}
                        data-testid={ACCOUNT_TAB_TYPES[keyName]}
                    />
                ))}
            </Tabs>
        </Card>
    );
};

TabsNav.propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    userState: userStateType.isRequired,
};

const GeneratedAlerts = ({ alerts }) => {
    if (isEmpty(alerts)) return null;

    return (
        <div data-testid='GeneratedAlerts'>
            {alerts.map(({ type = '', message = '' }) => {
                return (
                    <Alert variant={type} key={`alert-${message}`} mt={2}>
                        {message}
                    </Alert>
                );
            })}
        </div>
    );
};

GeneratedAlerts.propTypes = {
    alerts: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
        })
    ).isRequired,
};

const MemberNotifications = ({ memberNotifications = [], teamId, userState, togglePersonalNotifications }) => {
    if (!memberNotifications.length) return null;
    return (
        <div data-testid='MemberNotifications' className='accountHeader accountHeader-alt'>
            {[...memberNotifications].map(memberNotification => {
                return (
                    <div key={`memberNotification-${memberNotification.notificationType}`}>
                        <AccountTeamGatewayEmail
                            teamId={teamId}
                            userState={userState}
                            memberNotification={memberNotification}
                            togglePersonalNotifications={togglePersonalNotifications}
                        />
                    </div>
                );
            })}
        </div>
    );
};

MemberNotifications.propTypes = {
    memberNotifications: PropTypes.arrayOf(PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string })).isRequired,
    teamId: PropTypes.string.isRequired,
    userState: userStateType.isRequired,
    togglePersonalNotifications: PropTypes.func.isRequired,
};

const TeamNotifications = ({
    teamGatewayNotifications = [],
    teamId,
    toggleTeamNotifications,
    handleFieldChange,
    handleRemoveClick,
    handleAddClick,
    userState,
}) => {
    if (!teamGatewayNotifications.length) return null;
    return (
        <div data-testid='TeamNotifications' className='accountHeader accountHeader-alt'>
            {[...teamGatewayNotifications].map((teamNotification, index) => {
                return (
                    <div key={`teamNotificationOverview-${teamNotification.notificationType}`}>
                        <AccountTeamGatewayNotificationEmails
                            userState={userState}
                            teamId={teamId}
                            teamNotification={teamNotification}
                            toggleTeamNotifications={toggleTeamNotifications}
                        />
                        {teamNotification.optIn ? (
                            <Box ml={2} mr={2}>
                                <P>Team email</P>
                                <AccountTeamFieldRepeater
                                    id={index}
                                    teamId={teamId}
                                    userState={userState}
                                    teamNotification={teamNotification}
                                    handleFieldChange={handleFieldChange}
                                    handleRemoveClick={handleRemoveClick}
                                    handleAddClick={handleAddClick}
                                />
                            </Box>
                        ) : (
                            ''
                        )}
                    </div>
                );
            })}
        </div>
    );
};

TeamNotifications.propTypes = {
    teamGatewayNotifications: teamGatewayNotificationsType.isRequired,
    teamId: PropTypes.string.isRequired,
    toggleTeamNotifications: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleAddClick: PropTypes.func.isRequired,
    userState: userStateType.isRequired,
};

const NotificationTab = ({
    memberNotifications = [],
    teamId,
    userState,
    togglePersonalNotifications,
    teamGatewayNotifications,
    toggleTeamNotifications,
    handleFieldChange,
    handleRemoveClick,
    handleAddClick,
}) => {
    return (
        <LayoutContent data-testid='NotificationTab'>
            <EmailNotificationsHeader />
            <MemberNotifications
                memberNotifications={memberNotifications}
                teamId={teamId}
                userState={userState}
                togglePersonalNotifications={togglePersonalNotifications}
            />
            <TeamNotifications
                userState={userState}
                teamGatewayNotifications={teamGatewayNotifications}
                teamId={teamId}
                toggleTeamNotifications={toggleTeamNotifications}
                handleFieldChange={handleFieldChange}
                handleRemoveClick={handleRemoveClick}
                handleAddClick={handleAddClick}
            />
        </LayoutContent>
    );
};

NotificationTab.propTypes = {
    memberNotifications: PropTypes.arrayOf(PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string })).isRequired,
    teamId: PropTypes.string.isRequired,
    userState: userStateType.isRequired,
    togglePersonalNotifications: PropTypes.func.isRequired,
    teamGatewayNotifications: teamGatewayNotificationsType.isRequired,
    toggleTeamNotifications: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    handleAddClick: PropTypes.func.isRequired,
};

export {
    MemberNotifications,
    TeamNotifications,
    NotificationTab,
    EmailNotificationsHeader,
    TabsNav,
    TeamManagementHeader,
    GeneratedAlerts,
    LoaderRow,
};
