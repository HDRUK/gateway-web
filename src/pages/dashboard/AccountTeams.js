import axios from 'axios';
import { Box } from 'hdruk-react-core';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Pagination, Row } from 'react-bootstrap';
import { authUtils } from 'utils';

import { LayoutContent } from 'components';
import { baseURL } from '../../configs/url.config';

import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import AddEditTeamsPage from './Team/AddEditTeamsPage';
import TeamInfo from './Team/TeamInfo';
import { tabTypes } from './Team/teamUtil';

const maxResults = 40;

const AccountTeams = () => {
    // state
    const [isLoading, setLoading] = useState(false);
    const [teams, setTeams] = useState();
    const [teamsCount, setTeamsCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [viewTeams, setViewTeams] = useState(true);
    const [editTeamsView, setEditTeamsView] = useState(false);
    const [editViewID, setEditViewID] = useState(false);
    const [editViewMemberOf, setEditViewMemberOf] = useState('');
    const [editViewOrgName, setEditViewOrgName] = useState('');
    const [editViewTeamManagers, setEditViewTeamManagers] = useState([]);
    const [questionBankEnabled, setQuestionBankEnabled] = useState(false);
    const [dataUseWidgetEnabled, setDataUseWidgetEnabled] = useState(false);
    const [alert, setAlert] = useState();
    const [activeTabKey] = useState(tabTypes.Teams);

    const handlePaginatedItems = () => {
        // Returns the related resources that have the same object type as the current active tab and performs a chunk on them to ensure each page returns 24 results
        const paginatedItems = _.chunk(teams, maxResults);
        // If there are items to show based on search results, display them on the currently active page
        if (paginatedItems.length > 0) {
            return paginatedItems[activeIndex];
        }
        return [];
    };

    const getTeams = () => {
        setLoading(true);
        axios
            .get(`${baseURL}/api/v1/teams`)
            .then(res => {
                setTeams(res.data.teams);
                setTeamsCount(res.data.teams.length);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err.message);
            });
    };

    const createTeam = () => {
        setEditTeamsView(false);
        setViewTeams(false);
    };

    const editTeam = (publisher, teamManagers) => {
        setQuestionBankEnabled(publisher.publisherDetails.questionBank?.enabled);
        setDataUseWidgetEnabled(publisher.publisherDetails.dataUse?.widget?.enabled);
        setEditViewID(publisher._id);
        setEditViewMemberOf(publisher.publisherDetails.memberOf);
        setEditViewOrgName(publisher.publisherDetails.name);

        const teamManagerNames = teamManagers.map(teamManager => {
            return `${teamManager.firstname} ${teamManager.lastname}`;
        });
        setEditViewTeamManagers(teamManagerNames);

        setViewTeams(false);
        setEditTeamsView(true);
    };

    const setAlertFunction = alert => {
        getTeams();
        setAlert(alert);
    };

    const cancelCreateOrEditTeam = () => {
        setViewTeams(true);
    };
    const paginationItems = [];
    for (let i = 1; i <= Math.ceil(teamsCount / maxResults); i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === activeIndex + 1}
                onClick={e => {
                    setActiveIndex(i - 1);
                }}>
                {i}
            </Pagination.Item>
        );
    }
    // lifecycle hook
    useEffect(() => {
        // only call get teams on tab change
        if (activeTabKey === tabTypes.Teams) getTeams();
    }, [activeTabKey]);

    if (isLoading) {
        return (
            <LayoutContent>
                <Loading data-testid='isLoading' />
            </LayoutContent>
        );
    }

    return (
        <>
            {viewTeams ? (
                <LayoutContent>
                    <Row className='w-100'>
                        {!_.isEmpty(alert) && (
                            <Box flexGrow='1'>
                                <Alert variant='success'>{alert.message}</Alert>
                            </Box>
                        )}
                    </Row>
                    <Row className='accountHeader'>
                        <Col sm={12} md={8}>
                            <Row>
                                <span className='black-20'>Teams</span>
                            </Row>
                            <Row>
                                <span className='gray700-13 '>Organise and manage team members and the teams email notifications.</span>
                            </Row>
                        </Col>
                        <Col sm={12} md={4} style={{ textAlign: 'right' }}>
                            <Button data-testid='add-team-btn' variant='primary' href='' className='addButton' onClick={() => createTeam()}>
                                + Add a new team
                            </Button>
                        </Col>
                    </Row>
                    <Row className='subHeader mt-3 gray800-14-bold'>
                        <Col sm={2}>Updated</Col>
                        <Col sm={2}>Data custodian</Col>
                        <Col sm={2}>Team admin(s)</Col>
                        <Col sm={2} className='text-center'>
                            Members
                        </Col>
                        <Col sm={1}>Question Bank Enabled?</Col>
                        <Col sm={1}>Data use widget Enabled?</Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            {teams &&
                                teams.length > 0 &&
                                handlePaginatedItems().map(team => {
                                    return (
                                        <TeamInfo
                                            updatedAt={team.updatedAt}
                                            publisher={team.publisher}
                                            teamManagers={authUtils.getCustodianTeamAdmins(team)}
                                            membersCount={team.membersCount}
                                            editTeam={editTeam}
                                        />
                                    );
                                })}
                            <div className='text-center entityDashboardPagination'>
                                {teamsCount > maxResults ? <Pagination>{paginationItems}</Pagination> : ''}
                            </div>
                        </Col>
                    </Row>
                </LayoutContent>
            ) : (
                <AddEditTeamsPage
                    cancelAddEdit={cancelCreateOrEditTeam}
                    editTeamsView={editTeamsView}
                    editViewID={editViewID}
                    editViewMemberOf={editViewMemberOf}
                    editViewOrgName={editViewOrgName}
                    editViewTeamManagers={editViewTeamManagers}
                    questionBankEnabled={questionBankEnabled}
                    dataUseWidgetEnabled={dataUseWidgetEnabled}
                    setAlertFunction={setAlertFunction}
                />
            )}
        </>
    );
};

export default AccountTeams;
