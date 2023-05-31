import { Button } from 'hdruk-react-core';
import { forwardRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import './ActionBarMenu.scss';

const ActionBarMenu = ({ label, options = [], disabled, variant = 'secondary', alignStart }) => {
    const CustomToggle = forwardRef(({ children, onClick }, ref) => (
        <a
            className='nested-button'
            href='#'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                if (!disabled) {
                    onClick(e);
                }
            }}>
            {children}
        </a>
    ));

    return (
        <>
            {options.length > 0 && options.some(option => option.actions.length > 0) && (
                <Dropdown drop='up'>
                    <Dropdown.Toggle as={CustomToggle}>
                        <Button variant={variant} className={`${disabled ? 'disabled' : ''}`} disabled={disabled}>
                            {label}
                        </Button>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        className={`actionMenuDropdown${alignStart ? ' actionMenuDropdown__start' : ''}`}
                        flip={false}
                        align='end'>
                        {options.map(option => {
                            return (
                                option.actions.length > 0 && (
                                    <>
                                        <div className='actionMenuSection'>
                                            {(option.description || option.detailedDescription) && (
                                                <div className='actionMenuHeader'>
                                                    <span className='gray800-14-bold description'>{option.description}</span>
                                                    {option.detailedDescription && (
                                                        <span className='gray700-13 detailedDescription'>{option.detailedDescription}</span>
                                                    )}
                                                </div>
                                            )}

                                            {option.actions.map(action => {
                                                return (
                                                    <div
                                                        className='pointer option'
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            action.onClick(e);
                                                        }}>
                                                        <span className='gray800-14 title' style={{ marginTop: '0px' }}>
                                                            {action.title}
                                                        </span>
                                                        {action.description && (
                                                            <span className='gray700-13 description'>{action.description}</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};

export default ActionBarMenu;
