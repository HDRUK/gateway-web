import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Button, Box } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import { Table, LayoutContent } from 'components';
import { PermissionDescriptions } from 'modules';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountTeamMembersModal from '../AccountTeamMembersModal';
import { useAuth } from '../../context/AuthContext';
import teamsService from '../../services/teams';
import { ActionCell, DataAccessRequestCell, MetadataCell, NameCell, TeamAdminCell, HeaderTooltip } from './AccountTeamMembers.components';
import { ROLES_ADMIN, ROLES_MANAGER, ROLES_REVIEWER, ROLES_METADATA_EDITOR } from 'configs';

const AccountTeamMembers = ({ teamId }) => {
    const { isTeamManager, managerInTeam } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState();
    const [checkboxes, setCheckboxes] = useState({});
    const { t } = useTranslation();

    const getMembersRequest = teamsService.useGetMembers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    useEffect(() => {
        const init = () => {
            if (teamId) {
                getMembersRequest.mutateAsync(teamId).then(({ data: { members } }) => {
                    /**
                     * GAT-1678: currently static
                     *
                     * const initialCheckboxes = {};
                     *
                     * members.forEach((member) => {
                     *   initialCheckboxes[someId] = someBoolean;
                     * });
                     *
                     * setCheckboxes(initialCheckboxes);
                     */

                    setTeamMembers(members);

                    // TODO: GAT-1510:042
                    managerInTeam(teamId);
                });
            }
        };

        init();
    }, [teamId]);

    const handleDeleteMember = id => {
        console.log(`delete member: ${id}`);
    };

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const handleMemberAdded = addedMembers => {
        setTeamMembers(addedMembers);
    };

    const handleCheckboxChange = useCallback(({ target: { id, checked } }) => {
        setCheckboxes({
            [id]: checked,
            ...checkboxes,
        });
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: t('name'),
                accessor: 'name',
                Cell: ({ row: { original } }) => <NameCell member={original} />,
            },
            {
                Header: <HeaderTooltip header={t('teamAdmin')} content={<PermissionDescriptions roles={[ROLES_ADMIN.value]} />} />,
                accessor: 'teamAdmin',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => (
                    <TeamAdminCell member={original} onChange={handleCheckboxChange} checkboxes={checkboxes} />
                ),
            },
            {
                Header: (
                    <HeaderTooltip
                        header={t('dataAccessRequest')}
                        content={<PermissionDescriptions roles={[ROLES_MANAGER.value, ROLES_REVIEWER.value]} />}
                    />
                ),
                accessor: 'dataAccessRequest',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => (
                    <DataAccessRequestCell member={original} onChange={handleCheckboxChange} checkboxes={checkboxes} />
                ),
            },
            {
                Header: (
                    <HeaderTooltip
                        header={t('metadata')}
                        content={<PermissionDescriptions roles={[ROLES_MANAGER.value, ROLES_METADATA_EDITOR.value]} />}
                    />
                ),
                accessor: 'metadata',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => <MetadataCell member={original} onChange={handleCheckboxChange} checkboxes={checkboxes} />,
            },
            {
                Header: 'Further Actions',
                id: 'actions',
                Cell: ({ row: { original } }) => (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ActionCell member={original} onDeleteMember={handleDeleteMember} />
                    </div>
                ),
                styles: {
                    width: '147px',
                },
            },
        ],
        []
    );

    if (getMembersRequest.isLoading) {
        return (
            <LayoutContent>
                <Loading />
            </LayoutContent>
        );
    }

    return (
        <LayoutContent data-testid='AccountTeamMembers'>
            {teamMembers.length <= 0 && <MessageNotFound word='members' />}
            {teamMembers.length > 0 && (
                <Card>
                    <Table columns={columns} data={teamMembers} />
                </Card>
            )}
            {isTeamManager && (
                <Card>
                    <Box p={6} display='flex' justifyContent='center'>
                        <Button variant='primary' onClick={handleOpenModal}>
                            {t('components.AccountTeamMembers.members.add')}
                        </Button>
                    </Box>
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
