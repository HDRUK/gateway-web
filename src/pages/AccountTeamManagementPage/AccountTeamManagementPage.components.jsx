import React from 'react';
import { Alert } from 'components';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import { isEmpty, upperFirst } from 'lodash';
import { accountConsts } from 'consts';
import Loading from '../commonComponents/Loading';
import { userRoleIsAdmin } from './AccountTeamManagementPage.utils';

const { tabTypes } = accountConsts;

const EmailNotificationsHeader = () => {
    return (
        <div className='accountHeader dataAccessHeader'>
            <Col xs={12}>
                <Row>
                    <div className='black-20-semibold'>Email notifications</div>
                    <div className='gray700-14'>
                        Team related email notifications will automatically be sent to each team members Gateway log in email. Data
                        custodian managers can choose to send notifications to additional email accounts.
                    </div>
                </Row>
            </Col>
        </div>
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
    return (
        <div className='accountHeader dataAccessHeader'>
            <Col xs={8}>
                <Row>
                    <div className='black-20'>Team management</div>
                    <div className='gray700-14'>Organise and manage team members and the teams email notifications.</div>
                </Row>
            </Col>
            <Col xs={4} style={{ textAlign: 'right' }} />
        </div>
    );
};

const TabsNav = ({ activeTabKey, onTabChange, teamId, userState }) => {
    return (
        <div className='tabsBackground'>
            <Col sm={12} lg={12}>
                <Tabs className='dataAccessTabs gray700-14' activeKey={activeTabKey} onSelect={onTabChange}>
                    {/* TODO: GAT-1510:020 */}
                    {!userRoleIsAdmin(teamId, userState)
                        ? Object.keys(tabTypes).map((keyName, i) => (
                              <Tab
                                  key={i}
                                  eventKey={`${tabTypes[keyName]}`}
                                  title={`${upperFirst(tabTypes[keyName])}`}
                                  data-testid={tabTypes[keyName]}
                              />
                          ))
                        : ''}
                </Tabs>
            </Col>
        </div>
    );
};

const GeneratedAlerts = ({ alerts }) => {
    if (!isEmpty(alerts)) {
        return (
            <>
                {alerts.map(alert => {
                    const { type = '', message = '' } = alert;
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

export { EmailNotificationsHeader, TabsNav, TeamManagementHeader, GeneratedAlerts, LoaderRow };
