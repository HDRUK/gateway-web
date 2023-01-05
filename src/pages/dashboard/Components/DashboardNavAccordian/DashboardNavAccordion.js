import { Accordion } from 'react-bootstrap';

import { Icon } from 'hdruk-react-core';

import { accountUtils } from 'utils';
import DashboardSubNavItem from '../DashboardSubNavItem';
import handleAnalytics from '../../../dataAccessRequestCustomiseForm/handleAnalytics';

const DashboardNavAccordion = ({ teamId, activeKey, tabId, eventKey, onSelect, data }) => {
    return (
        <Accordion activeKey={activeKey} onSelect={onSelect}>
            <Accordion.Toggle variant='link' className='verticalNavBar gray700-13 navLinkButton' eventKey={eventKey}>
                <Icon svg={data.icon} fill='grey500' color='grey500' size='2xl' />
                <span className='navLinkItem'>{data.text}</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={eventKey}>
                <div>
                    BOOOOO
                    {data.children.map(({ id, text }) => (
                        <DashboardSubNavItem
                            key={id}
                            to={`/account?tab=${id}`}
                            active={tabId === id}
                            onClick={() => {
                                accountUtils.updateTeamType({ teamType: 'team', teamId });
                                handleAnalytics(`Clicked on ${id}`, text);
                            }}>
                            {text}
                        </DashboardSubNavItem>
                    ))}
                </div>
            </Accordion.Collapse>
        </Accordion>
    );
};

DashboardNavAccordion.defaultProps = {
    onSelect: () => {},
};

export default DashboardNavAccordion;
