import React, { Fragment } from 'react';
import '../../DatasetOnboarding.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row } from 'react-bootstrap';

const CustodianActionButtons = ({ allowedNavigation = false, onNextClick, onActionClick, roles }) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href='javascript:void(0)'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </a>
    ));

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <button className='button-secondary'>Make a decision</button>
                </Dropdown.Toggle>
                <Dropdown.Menu className='makeADecisionDropdown'>
                    {roles.includes('admin') && (
                        <>
                            <Row className='makeADecisionHeader'>
                                <span className='gray800-14-bold'>Make a decision</span>
                            </Row>
                            <div className='gray800-14 pointer option' onClick={e => onActionClick('Approve')}>
                                Approve
                            </div>
                            <div className='gray800-14 pointer option' onClick={e => onActionClick('Reject')}>
                                Reject
                            </div>
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            <button className={`button-primary ${allowedNavigation ? '' : 'disabled'}`} onClick={e => onNextClick()}>
                Next
            </button>
        </>
    );
};

export default CustodianActionButtons;
