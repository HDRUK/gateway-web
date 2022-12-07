import { forwardRef, Children, useState, useEffect } from 'react';
import axios from 'axios';
import '../CommonComponents.scss';
import { Dropdown } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';

const baseURL = require('../BaseURL');

const cmsURL = baseURL.getCMSURL();
const env = baseURL.getURLEnv();
const local = 'local';

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        href='javascript:void(0)'
        ref={ref}
        className='cmsDropdownTitle'
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}>
        {children}
        <SVGIcon name='chevronbottom' fill='#475DA7' className='svg-16 floatRightChevron' />
    </a>
));

const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled'>
                {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

const CustomSubMenu = forwardRef(({ children, style, className, show, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');
    if (show) {
        return (
            <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
                <ul className='list-unstyled'>
                    {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
                </ul>
            </div>
        );
    }
    return null;
});

export const CmsDropdown = props => {
    const [dropdownUrl] = useState(props.dropdownUrl);
    const [dropdownLinks, setDropdownLinks] = useState('');
    const [isMobile] = useState(props.isMobile);

    useEffect(() => {
        const url = env === local ? 'https://uatbeta.healthdatagateway.org' : cmsURL;

        axios
            .get(`${url}/${dropdownUrl}`, { withCredentials: false })

            .then(res => {
                setDropdownLinks(res.data);
            });
    }, []);

    const getDropdownTitle = dropdownUrl => {
        const dropdownUrls = new Map([
            ['exploreDropdown', 'Explore'],
            ['helpDropdown', 'Help'],
            ['usageDataDropdown', 'Usage Data'],
            ['aboutUsDropdown', 'About Us'],
        ]);

        const dropdownTitle = dropdownUrls.get(dropdownUrl.trim());

        return dropdownTitle;
    };

    return (
        <Dropdown className='cmsDropdown'>
            <Dropdown.Toggle as={CustomToggle}>
                <span>{getDropdownTitle(dropdownUrl)}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu as={isMobile === true ? CustomSubMenu : CustomMenu} className='cmsDropdownMenu'>
                {dropdownLinks !== '' ? <div dangerouslySetInnerHTML={{ __html: dropdownLinks }} /> : <div className='footerBottom' />}{' '}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CmsDropdown;
