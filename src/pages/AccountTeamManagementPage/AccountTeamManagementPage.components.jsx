import React from 'react';
import { Alert, LayoutContent } from 'components';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { isEmpty, upperFirst } from 'lodash';
import { ACCOUNT_TAB_TYPES } from 'consts';
import { AccountTeamFieldRepeater, AccountTeamGatewayNotificationEmails, AccountTeamGatewayEmail } from 'modules';
import PropTypes from 'prop-types';
import { userStateType } from 'types';
import { Card, H2, P, Typography, Box } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import Loading from '../commonComponents/Loading';
import { userRoleIsAdmin } from './AccountTeamManagementPage.utils';

const EmailNotificationsHeader = () => {
    const { t } = useTranslation();
    return (
        <Card style={{ padding: '30px 20px' }}>
            <H2>{t('pages.AccountTeamManagement.emailNotificationsTitle')}</H2>
            <P color='grey700'>{t('pages.AccountTeamManagement.emailNotificationsDescription')}</P>
        </Card>
    );
};
const LoaderRow = () => (
    <Row>
        <Col xs={1} />
        <Col xs={10}>
            <Loading data-testid='isLoading' />
        </Col>
        <Col xs={1} />
    </Row>
);

const TeamManagementHeader = () => {
    const { t } = useTranslation();
    return (
        <Card style={{ padding: '30px 20px' }}>
            <Typography variant='h2' as='h1' mb={2}>
                {t('pages.AccountTeamManagement.title')}
            </Typography>
            <P color='grey700'>
                {t('pages.AccountTeamManagement.description')} <a href='/support'>{t('supportLinkText')}.</a>
            </P>
        </Card>
    );
};

const TabsNav = ({ activeTabKey, onTabChange, teamId, userState }) => {
    return (
        <div className='tabsBackground'>
            <Col>
                <Tabs className='dataAccessTabs' activeKey={activeTabKey} onSelect={onTabChange}>
                    {/* TODO: GAT-1510:020 */}
                    {!userRoleIsAdmin(teamId, userState)
                        ? Object.keys(ACCOUNT_TAB_TYPES).map(keyName => (
                              <Tab
                                  key={keyName}
                                  eventKey={`${ACCOUNT_TAB_TYPES[keyName]}`}
                                  title={<P>{upperFirst(ACCOUNT_TAB_TYPES[keyName])}</P>}
                                  data-testid={ACCOUNT_TAB_TYPES[keyName]}
                              />
                          ))
                        : ''}
                </Tabs>
            </Col>
        </div>
    );
};

TabsNav.propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    teamId: PropTypes.number.isRequired,
    userState: userStateType.isRequired,
};

const GeneratedAlerts = ({ alerts }) => {
    if (!isEmpty(alerts)) {
        return (
            <>
                {alerts.map(({ type = '', message = '' }) => {
                    return (
                        <Alert variant={type} key={`alert-${message}`} mt={2}>
                            {message}
                        </Alert>
                    );
                })}
            </>
        );
    }
    return null;
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
    return (
        <div className='accountHeader accountHeader-alt'>
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
}) => {
    return (
        <div className='accountHeader accountHeader-alt'>
            {[...teamGatewayNotifications].map(teamNotification => {
                return (
                    <div key={`teamNotificationOverview-${teamNotification.notificationType}`}>
                        <AccountTeamGatewayNotificationEmails
                            teamId={teamId}
                            teamNotification={teamNotification}
                            toggleTeamNotifications={toggleTeamNotifications}
                        />
                        {teamNotification.optIn ? (
                            <Box ml={2} mr={2}>
                                <P>Team email</P>
                                <AccountTeamFieldRepeater
                                    teamId={teamId}
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
    teamGatewayNotifications: PropTypes.arrayOf(PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string })).isRequired,
    teamId: PropTypes.string.isRequired,
    toggleTeamNotifications: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleAddClick: PropTypes.func.isRequired,
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
        <LayoutContent>
            <div className='col-sm-10'>
                <EmailNotificationsHeader />
                <MemberNotifications
                    memberNotifications={memberNotifications}
                    teamId={teamId}
                    userState={userState}
                    togglePersonalNotifications={togglePersonalNotifications}
                />
                <TeamNotifications
                    teamGatewayNotifications={teamGatewayNotifications}
                    teamId={teamId}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                />
            </div>
        </LayoutContent>
    );
};

NotificationTab.propTypes = {
    memberNotifications: PropTypes.arrayOf(PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string })).isRequired,
    teamId: PropTypes.string.isRequired,
    userState: userStateType.isRequired,
    togglePersonalNotifications: PropTypes.func.isRequired,
    teamGatewayNotifications: PropTypes.arrayOf(PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string })).isRequired,
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
