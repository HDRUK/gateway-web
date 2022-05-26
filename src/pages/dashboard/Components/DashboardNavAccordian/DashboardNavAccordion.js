import React from 'react';
import { Accordion } from 'react-bootstrap';
import Icon from '../../../../components/Icon';
import DashboardSubNavItem from '../DashboardSubNavItem';

const DashboardNavItem = ({ activeKey, tabId, eventKey, onSelect, onClick, data }) => {
    console.log(activeKey, tabId, eventKey);
    return (
        <Accordion activeKey={activeKey} onSelect={onSelect}>
            <Accordion.Toggle variant='link' className='verticalNavBar gray700-13 navLinkButton' eventKey={eventKey}>
                <Icon svg={data.icon} fill='grey500' color='grey500' size='2xl' />
                <span className='navLinkItem'>{data.text}</span>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={eventKey}>
                <div>
                    {data.children.map(({ id, text }) => (
                        <DashboardSubNavItem active={tabId === id} onClick={() => onClick(id)}>
                            {text}
                        </DashboardSubNavItem>
                    ))}
                </div>
            </Accordion.Collapse>
        </Accordion>
    );
};

DashboardNavItem.defaultProps = {
    onSelect: () => {},
    onClick: () => {},
};

export default DashboardNavItem;
