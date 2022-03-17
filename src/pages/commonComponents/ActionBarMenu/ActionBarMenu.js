import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const ActionBarMenu = ({ label, options = [], disabled, buttonClass = 'button-secondary' }) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href='javascript:void(0)'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                if (!disabled) {
                    onClick(e);
                }
            }}
        >
            {children}
        </a>
    ));
    console.log(options);
    return (
        <>
            {options.length > 0 && options.some(option => option.actions.length > 0) && (
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}>
                        <button className={`${buttonClass} ${disabled ? 'disabled' : ''}`} disabled={disabled}>
                            {label}
                        </button>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='actionMenuDropdown'>
                        {options.map(option => {
                            return (
                                option.actions.length > 0 && (
                                    <>
                                        <div className='actionMenuSection'>
                                            <div className='actionMenuHeader'>
                                                <span className='gray800-14-bold description'>{option.description}</span>
                                                {option.detailedDescription && (
                                                    <span className='gray700-13 detailedDescription'>{option.detailedDescription}</span>
                                                )}
                                            </div>

                                            {option.actions.map(action => {
                                                return (
                                                    <div
                                                        className='pointer option'
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            action.onClick(e);
                                                        }}
                                                    >
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
