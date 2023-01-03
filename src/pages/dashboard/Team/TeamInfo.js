import { Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import moment from 'moment';

import { Icon } from 'hdruk-react-core';

import { ReactComponent as TickIcon } from '../../../images/icons/tick-circle.svg';
import { ReactComponent as ErrorIcon } from '../../../images/icons/error-circle.svg';

const TeamInfo = ({ updatedAt, publisher, teamManagers, membersCount, editTeam }) => {
    const questionBankEnabled = publisher?.publisherDetails?.questionBank?.enabled;
    const dataUseWidgetEnabled = publisher?.publisherDetails?.dataUse?.widget?.enabled;

    const EnabledIcon = <Icon mr={2} size='3xl' fill='green400' svg={<TickIcon />} />;
    const DisabledIcon = <Icon mr={2} size='3xl' fill='red700' svg={<ErrorIcon />} />;

    let teamManagerNames = '';

    return (
        <Row className='entryBox gray800-14'>
            <Col sm={12} lg={2}>
                {moment(updatedAt).format('D MMMM YYYY HH:mm')}
            </Col>
            <Col sm={12} lg={2}>
                {publisher.name}
            </Col>
            <Col sm={12} lg={2}>
                {teamManagers &&
                    teamManagers.length > 0 &&
                    teamManagers.map((teamManager, index) => {
                        teamManagerNames += `${teamManager.firstname} ${teamManager.lastname}${
                            teamManagers.length === index + 1 ? '' : ', '
                        }`;
                    })}
                <p className='gray800-14'>
                    {teamManagerNames ? teamManagerNames.substr(0, 35) + (teamManagerNames.length > 35 ? '...' : '') : ''}
                </p>
            </Col>
            <Col sm={12} lg={2}>
                <p className='text-center'>{membersCount}</p>
            </Col>
            <Col sm={12} lg={1}>
                <p className='text-center'>{questionBankEnabled ? EnabledIcon : DisabledIcon}</p>
            </Col>
            <Col sm={12} lg={1}>
                <p className='text-center'>{dataUseWidgetEnabled ? EnabledIcon : DisabledIcon}</p>
            </Col>
            <Col sm={12} lg={2}>
                <DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
                    <Dropdown.Item onClick={() => editTeam(publisher, teamManagers)} className='black-14'>
                        Edit
                    </Dropdown.Item>
                </DropdownButton>
            </Col>
        </Row>
    );
};

export default TeamInfo;
