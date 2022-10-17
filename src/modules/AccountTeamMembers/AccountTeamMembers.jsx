import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, CardBody, Typography, Button, P, Box, H5 } from 'hdruk-react-core';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import { SUPPORT_URL } from 'consts';
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
                Header: 'Role',
                accessor: 'role',
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

    if (getMembersRequest.isLoading) {
        return (
            <LayoutContent>
                <Loading />
            </LayoutContent>
        );
    }

    return (
        <>
            <LayoutContent>
                <Card mb={4}>
                    <CardBody>
                        <H5 mb={1}>{t('members')}</H5>
                        <Box
                            display={{
                                md: 'flex',
                            }}
                            gap={8}>
                            <Box
                                mb={{
                                    xxs: 6,
                                    md: 0,
                                }}
                                flexGrow='1'>
                                <P mb={6}>
                                    {t('components.AccountMembers.members.description1')}: <a href={SUPPORT_URL}>{SUPPORT_URL}</a>
                                </P>
                                <P mb={6}>{t('components.AccountMembers.members.description2')}</P>
                                <P>{t('components.AccountMembers.members.description3')}</P>
                            </Box>
                            <Box
                                display={{
                                    md: 'flex',
                                }}
                                justifyContent='flex-end'
                                flexBasis={{
                                    md: '40%',
                                }}>
                                {isTeamManager && (
                                    <Button variant='primary' onClick={handleOpenModal}>
                                        {t('components.AccountMembers.members.add')}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </CardBody>
                </Card>

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
                                role: getRolesList(roles),
                            }))}
                        />
                    </Card>
                )}

                <AccountTeamMembersModal open={showModal} close={handleCloseModal} teamId={teamId} onMemberAdded={handleMemberAdded} />
            </LayoutContent>
        </>
    );
};

AccountTeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
};

export default AccountTeamMembers;
