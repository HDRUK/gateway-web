import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Typography, Button, P, Box, H5 } from 'hdruk-react-core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import { Checkbox } from 'components';
import ActionCard from 'components/ActionCard';
import { PERMISSIONS_USER_TYPES, SUPPORT_URL } from '../../consts';
import Table from '../../components/Table';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountTeamMembersModal from '../AccountTeamMembersModal';
import { LayoutContent } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import teamsService from '../../services/teams';
import { getRolesList } from '../../utils/auth';

const AccountTeamMembers = ({ teamId }) => {
    const { isTeamManager, managerInTeam } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState();
    const { t } = useTranslation();

    const getMembersRequest = teamsService.useGetMembers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Team Admin',
                accessor: 'teamAdmin',
                cellProps: {
                    valign: 'top',
                },
            },
            {
                Header: 'Data Access Request',
                accessor: 'dataAccessRequest',
                cellProps: {
                    valign: 'top',
                },
            },
            {
                Header: 'Metadata',
                accessor: 'metadata',
                cellProps: {
                    valign: 'top',
                },
            },
        ],
        []
    );

    useEffect(() => {
        const init = () => {
            if (teamId) {
                getMembersRequest.mutateAsync(teamId).then(({ data: { members } }) => {
                    setTeamMembers(members);

                    // TODO: GAT-1510:042
                    managerInTeam(teamId);
                });
            }
        };

        init();
    }, [teamId]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const handleMemberAdded = addedMembers => {
        setTeamMembers(addedMembers);
    };

    const handleCheckboxChange = ({ target: { id, checked } }) => {
        console.log({ id, checked });
    };

    if (getMembersRequest.isLoading) {
        return (
            <LayoutContent>
                <Loading />
            </LayoutContent>
        );
    }

    return (
        <LayoutContent>
            <ActionCard
                title={t('members')}
                content={
                    <>
                        <P mb={6}>
                            {t('components.AccountTeamMembers.members.description1')}: <a href={SUPPORT_URL}>{SUPPORT_URL}</a>
                        </P>
                        <P mb={6}>{t('components.AccountTeamMembers.members.description2')}</P>
                        <P>{t('components.AccountTeamMembers.members.description3')}</P>
                    </>
                }
                action={
                    isTeamManager && (
                        <Button variant='primary' onClick={handleOpenModal}>
                            {t('components.AccountTeamMembers.members.add')}
                        </Button>
                    )
                }
                mb={4}
            />

            {teamMembers.length <= 0 && <MessageNotFound word='members' />}
            {teamMembers.length > 0 && (
                <Card>
                    <Table
                        columns={columns}
                        data={teamMembers.map(({ lastname, firstname, id, bio, organisation, roles }) => ({
                            name: (
                                <>
                                    <Typography as={Link} to={`/person/${id}`} color='purple500'>
                                        {firstname} {lastname}
                                    </Typography>
                                    <Typography color='grey600'>{organisation || bio}</Typography>
                                </>
                            ),
                            teamAdmin: (
                                <Checkbox
                                    label='Admin'
                                    onChange={handleCheckboxChange}
                                    checked={roles.includes(PERMISSIONS_USER_TYPES.admin)}
                                    id={`${id}_admin`}
                                />
                            ),
                            dataAccessRequest: (
                                <>
                                    <Checkbox
                                        label='Manager'
                                        onChange={handleCheckboxChange}
                                        checked
                                        id={`${id}_dataAccessRequest_manager`}
                                    />
                                    <Checkbox label='Reviewer' onChange={handleCheckboxChange} id={`${id}_dataAccessRequest_reviewer`} />
                                </>
                            ),
                            metadata: (
                                <>
                                    <Checkbox label='Manager' onChange={handleCheckboxChange} checked id={`${id}_metadata_manager`} />
                                    <Checkbox label='Editor' onChange={handleCheckboxChange} id={`${id}_dataAccessRequest_reviewer`} />
                                </>
                            ),
                        }))}
                    />
                </Card>
            )}

            <AccountTeamMembersModal open={showModal} close={handleCloseModal} teamId={teamId} onMemberAdded={handleMemberAdded} />
        </LayoutContent>
    );
};

AccountTeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
};

export default AccountTeamMembers;
