import { useEffect, useState, useCallback } from 'react';
import { Card, Button, Box } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';

import { Table, LayoutContent, ConfirmationModal } from 'components';
import { PermissionDescriptions } from 'modules';
import {
    PERMISSIONS_TEAM_MEMBER_ROLES,
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from 'consts';
import { teamService } from 'services';

import { useCustodianRoles } from 'hooks';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
import AccountTeamMembersModal from '../AccountTeamMembersModal';
import { useAuth } from '../../context/AuthContext';
import { ActionCell, CheckboxCell, NameCell, HeaderTooltip } from './AccountTeamMembers.components';

const AccountTeamMembers = ({ teamId, handleDisplayAlert }) => {
    const { userState, isHDRAdmin } = useAuth();
    const { isCustodianTeamAdmin, isCustodianMetadataManager, isCustodianDarManager } = useCustodianRoles(teamId);
    const [teamMembers, setTeamMembers] = useState([]);
    const [showModal, setShowModal] = useState();
    const [userToRemove, setUserToRemove] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState({});
    const { t } = useTranslation();

    const getMembersRequest = teamService.useGetMembers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const patchMembersRequest = teamService.usePatchTeamMemberRequest(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const deleteMembersRequest = teamService.useDeleteTeamMemberRequest(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const populateCheckboxes = members => {
        const initialCheckboxes = {};

        members.forEach(member => {
            initialCheckboxes[member.userId] = {};
            member.roles.forEach(role => {
                initialCheckboxes[member.userId][role] = true;
            });
        });

        return initialCheckboxes;
    };

    useEffect(() => {
        const init = () => {
            if (teamId) {
                getMembersRequest.mutateAsync(teamId).then(({ data: { members } }) => {
                    const initialCheckboxes = populateCheckboxes(members);

                    setCheckboxValues(initialCheckboxes);
                    setTeamMembers(members);
                });
            }
        };

        init();
    }, [teamId, userState]);

    const handleRemoveUser = () => {
        setShowRemoveModal(false);
        deleteMembersRequest.mutateAsync({ teamId, userId: userToRemove.userId }).then(() => {
            setUserToRemove(null);
            setTeamMembers(teamMembers.filter(teamMember => teamMember.userId !== userToRemove.userId));
            handleDisplayAlert('User has been removed');
        });
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

    const handleCheckboxChange = async ({ roles, userId }) => {
        setCheckboxValues({ ...checkboxValues, [userId]: roles });

        const {
            data: { members },
        } = await patchMembersRequest.mutateAsync({
            teamId,
            userId,
            data: { roles: Object.keys(roles).filter(role => roles[role]) },
        });

        setTeamMembers(members);
    };

    const renderDisabledMessage = isDisabled => {
        return isDisabled ? t('components.AccountTeamMembers.disabledMessage') : '';
    };

    const getIsCheckboxDisabled = useCallback(
        role => {
            const darManagerHasPermission =
                isCustodianDarManager && [ROLE_CUSTODIAN_DAR_MANAGER, PERMISSIONS_TEAM_MEMBER_ROLES.reviewer].includes(role);

            const metadataManagerHasPermission =
                isCustodianMetadataManager &&
                [ROLE_CUSTODIAN_METADATA_MANAGER, PERMISSIONS_TEAM_MEMBER_ROLES.metadata_editor].includes(role);

            if (isCustodianTeamAdmin || darManagerHasPermission || metadataManagerHasPermission) {
                return false;
            }

            return true;
        },
        [isCustodianMetadataManager, isCustodianDarManager, isCustodianTeamAdmin]
    );

    const columns = [
        {
            Header: t('name'),
            accessor: 'name',
            Cell: ({ row: { original } }) => <NameCell member={original} />,
        },
        {
            Header: <HeaderTooltip header={t('teamAdmin')} content={<PermissionDescriptions roles={['admin']} />} />,
            accessor: 'teamAdmin',
            cellProps: {
                valign: 'top',
            },
            Cell: ({ row: { original } }) => (
                <CheckboxCell
                    title={renderDisabledMessage(getIsCheckboxDisabled(ROLE_CUSTODIAN_TEAM_ADMIN))}
                    disabled={getIsCheckboxDisabled(ROLE_CUSTODIAN_TEAM_ADMIN)}
                    userId={original.userId}
                    checkboxValues={checkboxValues[original.userId]}
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
                        <PermissionDescriptions roles={[PERMISSIONS_TEAM_MEMBER_ROLES.manager, PERMISSIONS_TEAM_MEMBER_ROLES.reviewer]} />
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
                        title={renderDisabledMessage(getIsCheckboxDisabled(ROLE_CUSTODIAN_DAR_MANAGER))}
                        disabled={getIsCheckboxDisabled(ROLE_CUSTODIAN_DAR_MANAGER)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
                        role={ROLE_CUSTODIAN_DAR_MANAGER}
                        label={t('manager')}
                        onChange={handleCheckboxChange}
                    />
                    <CheckboxCell
                        title={renderDisabledMessage(getIsCheckboxDisabled(PERMISSIONS_TEAM_MEMBER_ROLES.reviewer))}
                        disabled={getIsCheckboxDisabled(PERMISSIONS_TEAM_MEMBER_ROLES.reviewer)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
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
                        title={renderDisabledMessage(getIsCheckboxDisabled(ROLE_CUSTODIAN_METADATA_MANAGER))}
                        disabled={getIsCheckboxDisabled(ROLE_CUSTODIAN_METADATA_MANAGER)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
                        role={ROLE_CUSTODIAN_METADATA_MANAGER}
                        label={t('manager')}
                        onChange={handleCheckboxChange}
                    />
                    <CheckboxCell
                        title={renderDisabledMessage(getIsCheckboxDisabled(PERMISSIONS_TEAM_MEMBER_ROLES.metadata_editor))}
                        disabled={getIsCheckboxDisabled(PERMISSIONS_TEAM_MEMBER_ROLES.metadata_editor)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
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
                    <ActionCell
                        isHDRAdmin={isHDRAdmin}
                        isCustodianTeamAdmin={isCustodianTeamAdmin}
                        currentUser={userState[0]}
                        member={original}
                        onDeleteMember={() => {
                            setUserToRemove(original);
                            setShowRemoveModal(true);
                        }}
                    />
                </div>
            ),
            styles: {
                width: '147px',
            },
        },
    ];

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
            {isCustodianTeamAdmin && (
                <Card>
                    <Box p={6} display='flex' justifyContent='center'>
                        <Button variant='primary' onClick={handleOpenModal}>
                            {t('components.AccountTeamMembers.members.add')}
                        </Button>
                    </Box>
                </Card>
            )}
            <AccountTeamMembersModal isOpen={showModal} onClose={handleCloseModal} teamId={teamId} onMemberAdded={handleMemberAdded} />
            <ConfirmationModal
                title={`Are you sure you want to remove ${userToRemove?.firstname} ${userToRemove?.lastname}?`}
                isOpen={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                onSuccess={handleRemoveUser}
                successLabel='Remove'
            />
        </LayoutContent>
    );
};

AccountTeamMembers.propTypes = {
    teamId: PropTypes.string.isRequired,
    handleDisplayAlert: PropTypes.func.isRequired,
};

export default AccountTeamMembers;
