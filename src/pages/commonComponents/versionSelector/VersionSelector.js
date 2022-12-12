import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import './VersionSelector.scss';

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled margin-bottom-0'>
                {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

const VersionSelector = ({ selectedVersion = 'Version 1.0', versionList, displayType = 'smallTriangle', onToggleClick = () => {} }) => {
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            id='versionSelector'
            href='javascript:void(0)'
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onToggleClick(e);
                onClick(e);
            }}
        >
            {children}
        </a>
    ));

    const [isToggled, setIsToggled] = useState(false);

    const variants = {
        smallTriangle: {
            toggleClass: 'listOfVersionsButton',
        },
        chevron: {
            toggleClass: `selected selected-${isToggled ? 'down' : 'up'}`,
        },
    };

    return (
        <Dropdown className='versionDropdown' onToggle={() => setIsToggled(prevState => !prevState)}>
            <Dropdown.Toggle as={CustomToggle}>
                <span className={`gray800-14 ${variants[displayType].toggleClass}`}>{selectedVersion}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu as={CustomMenu} className='menu'>
                {versionList.map((version, index) => {
                    return (
                        <Dropdown.Item key={`version_${index}`} href={version.link} className='black-14 menu-item'>
                            <div>{version.detailedTitle}</div>
                            <div className='menu-item-check'>
                                {selectedVersion.includes(version.number) && (
                                    <SVGIcon name='checkicon' width={16} height={16} viewbox='0 0 16 16' fill={'#2c8267'} />
                                )}
                            </div>
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default VersionSelector;
