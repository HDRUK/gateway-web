import { useEffect, useState, useCallback } from 'react';
import { Card } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';

import { Table, LayoutContent, ConfirmationModal } from 'components';
import { PermissionDescriptions } from 'modules';
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
} from 'consts';
import { teamService } from 'services';

import { useCustodianRoles } from 'hooks';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import { useAuth } from '../../context/AuthContext';
import { ActionCell, CheckboxCell, NameCell, HeaderTooltip } from './AccountTeamMembers.components';

const AccountTeamMembers = ({ teamId, handleRemove, teamMembers }) => {
    const [filteredMembers, setFilteredMembers] = useState([]);
    const { userState, isHDRAdmin } = useAuth();
    const { isCustodianTeamAdmin, isCustodianMetadataManager, isCustodianDarManager } = useCustodianRoles(teamId);
    const [userToRemove, setUserToRemove] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [checkboxValues, setCheckboxValues] = useState({});
    const { t } = useTranslation();

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

    const populateCheckboxes = () => {
        const initialCheckboxes = {};

        teamMembers.forEach(member => {
            initialCheckboxes[member.userId] = {};
            member.roles.forEach(role => {
                initialCheckboxes[member.userId][role] = true;
            });
        });

        return initialCheckboxes;
    };

    useEffect(() => {
        if (teamMembers) {
            const initialCheckboxes = populateCheckboxes();

            setCheckboxValues(initialCheckboxes);
            setFilteredMembers(teamMembers);
        }
    }, [teamMembers]);

    const handleRemoveUser = () => {
        setShowRemoveModal(false);
        deleteMembersRequest.mutateAsync({ teamId, userId: userToRemove.userId }).then(() => {
            setUserToRemove(null);
            handleRemove([{ message: 'User has been removed', type: 'success' }]);
        });
    };

    const handleCheckboxChange = async ({ updatedRole, userId }) => {
        setCheckboxValues({ ...checkboxValues, [userId]: { ...checkboxValues[userId], ...updatedRole } });

        const {
            data: { members },
        } = await patchMembersRequest.mutateAsync({
            teamId,
            userId,
            data: updatedRole,
        });

        setFilteredMembers(members.reverse());
    };

    const renderDisabledMessage = isDisabled => {
        return isDisabled ? t('components.AccountTeamMembers.disabledMessage') : '';
    };

    const getIsCheckboxDisabled = useCallback(
        role => {
            const darManagerHasPermission =
                isCustodianDarManager && [ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_DAR_REVIEWER].includes(role);

            const metadataManagerHasPermission =
                isCustodianMetadataManager && [ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_METADATA_EDITOR].includes(role);

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
            Header: <HeaderTooltip header={t('teamAdmin')} content={<PermissionDescriptions roles={[ROLE_CUSTODIAN_TEAM_ADMIN]} />} />,
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
                    content={<PermissionDescriptions roles={[ROLE_CUSTODIAN_DAR_MANAGER, ROLE_CUSTODIAN_DAR_REVIEWER]} />}
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
                        title={renderDisabledMessage(getIsCheckboxDisabled(ROLE_CUSTODIAN_DAR_REVIEWER))}
                        disabled={getIsCheckboxDisabled(ROLE_CUSTODIAN_DAR_REVIEWER)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
                        role={ROLE_CUSTODIAN_DAR_REVIEWER}
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
                    content={<PermissionDescriptions roles={[ROLE_CUSTODIAN_METADATA_MANAGER, ROLE_CUSTODIAN_METADATA_EDITOR]} />}
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
                        title={renderDisabledMessage(getIsCheckboxDisabled(ROLE_CUSTODIAN_METADATA_EDITOR))}
                        disabled={getIsCheckboxDisabled(ROLE_CUSTODIAN_METADATA_EDITOR)}
                        userId={original.userId}
                        checkboxValues={checkboxValues[original.userId]}
                        role={ROLE_CUSTODIAN_METADATA_EDITOR}
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

    return (
        <LayoutContent data-testid='AccountTeamMembers'>
            {teamMembers.length <= 0 && <MessageNotFound word='members' />}
            {teamMembers.length > 0 && (
                <Card>
                    <Table columns={columns} data={filteredMembers} />
                </Card>
            )}
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
    handleRemove: PropTypes.func.isRequired,
    teamMembers: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, userId: PropTypes.string })).isRequired,
};

export default AccountTeamMembers;
