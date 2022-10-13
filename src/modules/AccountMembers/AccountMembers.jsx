import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Table } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { Card, CardBody, Typography, Button, CardHeader, P, Box, Caption } from 'hdruk-react-core';
import { Link } from 'react-router-dom';
import { ROLE_LIST } from '../../configs/constants';
import MessageNotFound from '../../pages/commonComponents/MessageNotFound';
import Loading from '../../pages/commonComponents/Loading';
// import '../../css/styles.scss';
// import './Dashboard.scss';
import AccountMembersModal from '../AccountMembersModal';
import { LayoutContent } from '../../components/Layout';
import { baseURL } from '../../configs/url.config';

export const AccountMembers = props => {
    const [userState] = useState(props.userState);
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [userIsManager, setUserIsManager] = useState(false);
    const [showAccountAddMemberModal, setShowAccountAddMemberModal] = useState(false);
    const [accountMembersId, setAccountMembersId] = useState(props.team);

    useEffect(() => {
        setAccountMembersId(props.team);
    }, [props]);

    useEffect(() => {
        doMembersCall().catch(console.error);
    }, [accountMembersId]);

    const doMembersCall = async () => {
        if (accountMembersId) {
            setIsLoading(true);
            await axios.get(`${baseURL}/api/v1/teams/${accountMembersId}/members`).then(async res => {
                setMembers(res.data.members);
                // TODO: GAT-1510:042
                setUserIsManager(res.data.members.filter(m => m.id === userState[0].id).map(m => m.roles[0] === 'manager')[0]);
            });
        }
        setIsLoading(false);
    };

    const onShowAccountMembersModal = () => {
        setShowAccountAddMemberModal(!showAccountAddMemberModal);
    };

    const onMemberAdded = members => {
        setMembers(members);
    };

    const getRoles = roles => {
        if (!isEmpty(roles)) {
            const sortedRoles = roles.sort();
            // TODO: GAT-1510:043
            return sortedRoles.map(role => ROLE_LIST[role]).join(', ');
        }
        return '';
    };

    if (isLoading) {
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
                    <CardHeader>Members</CardHeader>
                    <CardBody>
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
                                    To remove team members or change their roles, please raise a support ticket at the following link:{' '}
                                    <a href='https://hdruk.atlassian.net/servicedesk/customer/portal/1'>
                                        https://hdruk.atlassian.net/servicedesk/customer/portal/1
                                    </a>
                                </P>
                                <P mb={6}>
                                    Managers can; manage members, create and assign workflows, review applications that are assigned to them
                                    and make the final decision on data access request applications.
                                </P>
                                <P>Reviewers can review applications that are assigned to them.</P>
                            </Box>
                            <Box
                                display={{
                                    md: 'flex',
                                }}
                                justifyContent='flex-end'
                                flexBasis={{
                                    md: '40%',
                                }}>
                                <Button variant='primary' onClick={onShowAccountMembersModal}>
                                    + Add a new member
                                </Button>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>

                {members.length <= 0 && (
                    <Row className='margin-right-15'>
                        <MessageNotFound word='members' />
                    </Row>
                )}
                {members.length > 0 && (
                    <Box backgroundColor='white'>
                        <Table className='dashboard-results'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map(m => {
                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                <Typography as={Link} to={`/person/${m.id}`} color='purple500'>
                                                    {m.firstname} {m.lastname}
                                                </Typography>
                                                <Typography color='grey600'>{m.organisation ? m.organisation : m.bio}</Typography>
                                            </td>
                                            <td>
                                                <Caption>{getRoles(m.roles)}</Caption>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Box>
                )}

                <AccountMembersModal
                    open={showAccountAddMemberModal}
                    close={onShowAccountMembersModal}
                    teamId={accountMembersId}
                    onMemberAdded={onMemberAdded}
                />
            </LayoutContent>
        </>
    );
};

export default AccountMembers;
