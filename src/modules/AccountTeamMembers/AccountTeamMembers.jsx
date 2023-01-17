import { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Button, Box } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';

import { Table, LayoutContent } from 'components';
import { PermissionDescriptions } from 'modules';
import {
    PERMISSIONS_TEAM_MEMBER_ROLES,
    PERMISSIONS_TEAM_MEMBER_ROLE_ADMIN,
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from 'consts';
import { accountUtils, roleUtils } from 'utils';
import { teamService } from 'services';

import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountTeamMembersModal from '../AccountTeamMembersModal';
import { useAuth } from '../../context/AuthContext';
import { ActionCell, CheckboxCell, NameCell, HeaderTooltip } from './AccountTeamMembers.components';

const AccountTeamMembers = ({ teamId }) => {
    const { userState } = useAuth();
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState();
    const [checkboxValues, setCheckboxValues] = useState({});
    const { t } = useTranslation();
    const [isTeamAdmin, setIsTeamAdmin] = useState(false);

    const getMembersRequest = teamService.useGetMembers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    useEffect(() => {
        const init = () => {
            if (teamId) {
                getMembersRequest.mutateAsync(teamId).then(({ data: { members } }) => {
                    const initialCheckboxes = {};

                    members.forEach(member => {
                        initialCheckboxes[member._id] = {};
                        member.roles.forEach(role => {
                            initialCheckboxes[member._id][role] = true;
                        });
                    });

                    setCheckboxValues(initialCheckboxes);
                    setTeamMembers(members);

                    // TODO: GAT-1510:042
                    const team = accountUtils.getTeam(userState[0]?.teams, teamId);
                    setIsTeamAdmin(roleUtils.getIsTeamAdmin(team));
                });
            }
        };

        init();
    }, [teamId, userState]);

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

    const handleCheckboxChange = useCallback(({ role, checked, memberId }) => {
        console.log({ role, checked, memberId });
    }, []);

    const columns = useMemo(
        () => [
            {
                Header: t('name'),
                accessor: 'name',
                Cell: ({ row: { original } }) => <NameCell member={original} />,
            },
            {
                Header: (
                    <HeaderTooltip
                        header={t('teamAdmin')}
                        content={<PermissionDescriptions roles={[PERMISSIONS_TEAM_MEMBER_ROLE_ADMIN]} />}
                    />
                ),
                accessor: 'teamAdmin',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => (
                    <CheckboxCell
                        memberId={original._id}
                        checkboxValues={checkboxValues}
                        role={ROLE_CUSTODIAN_TEAM_ADMIN}
                        label={t('admin')}
                        onChange={handleCheckboxChange}
                    />
                ),
            },
            {
                Header: (
                    <HeaderTooltip
                        header={t('dataAccessRequest')}
                        content={
                            <PermissionDescriptions
                                roles={[PERMISSIONS_TEAM_MEMBER_ROLES.manager, PERMISSIONS_TEAM_MEMBER_ROLES.reviewer]}
                            />
                        }
                    />
                ),
                accessor: 'dataAccessRequest',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => (
                    <>
                        <CheckboxCell
                            memberId={original._id}
                            checkboxValues={checkboxValues}
                            role={ROLE_CUSTODIAN_DAR_MANAGER}
                            label={t('manager')}
                            onChange={handleCheckboxChange}
                        />
                        <CheckboxCell
                            memberId={original._id}
                            checkboxValues={checkboxValues}
                            role={PERMISSIONS_TEAM_MEMBER_ROLES.reviewer}
                            label={t('reviewer')}
                            onChange={handleCheckboxChange}
                        />
                    </>
                ),
            },
            {
                Header: (
                    <HeaderTooltip
                        header={t('metadata')}
                        content={
                            <PermissionDescriptions
                                roles={[PERMISSIONS_TEAM_MEMBER_ROLES.manager, PERMISSIONS_TEAM_MEMBER_ROLES.metadata_editor]}
                            />
                        }
                    />
                ),
                accessor: 'metadata',
                cellProps: {
                    valign: 'top',
                },
                Cell: ({ row: { original } }) => (
                    <>
                        <CheckboxCell
                            memberId={original._id}
                            checkboxValues={checkboxValues}
                            role={ROLE_CUSTODIAN_METADATA_MANAGER}
                            label={t('manager')}
                            onChange={handleCheckboxChange}
                        />
                        <CheckboxCell
                            memberId={original._id}
                            checkboxValues={checkboxValues}
                            role={PERMISSIONS_TEAM_MEMBER_ROLES.metadata_editor}
                            label={t('editor')}
                            onChange={handleCheckboxChange}
                        />
                    </>
                ),
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
        [checkboxValues]
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
            {isTeamAdmin && (
                <Card>
                    <Box p={6} display='flex' justifyContent='center'>
                        <Button variant='primary' onClick={handleOpenModal}>
                            {t('components.AccountTeamMembers.members.add')}
                        </Button>
                    </Box>
                </Card>
            )}
            <AccountTeamMembersModal isOpen={showModal} onClose={handleCloseModal} teamId={teamId} onMemberAdded={handleMemberAdded} />
        </LayoutContent>
    );
};

AccountTeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
};

export default AccountTeamMembers;
