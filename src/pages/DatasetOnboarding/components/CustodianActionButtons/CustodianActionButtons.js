import { forwardRef } from 'react';
import '../../DatasetOnboarding.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';

const CustodianActionButtons = ({ allowedNavigation = false, onNextClick, onActionClick, roles }) => {
    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <a
            href='#'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}>
            {children}
        </a>
    ));

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <Button variant='secondary'>Make a decision</Button>
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

            <Button className={`${allowedNavigation ? '' : 'disabled'}`} onClick={e => onNextClick()}>
                Next
            </Button>
        </>
    );
};

export default CustodianActionButtons;
