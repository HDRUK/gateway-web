import { forwardRef, Children, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ReactComponent as ChevronBottom } from '../../../images/chevron-bottom.svg';
import googleAnalytics from '../../../tracking';
import './AddNewEntity.scss';

const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled mb-0 mt-0'>
                {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

const CustomToggle = forwardRef(({ children, onClick, loggedIn, showLoginModal }, ref) => (
    <button
        href=''
        ref={ref}
        onClick={e => {
            e.preventDefault();
            if (loggedIn) {
                onClick(e);
            } else {
                showLoginModal();
            }
        }}
        className='addNewEntityDropdown'>
        {children}
    </button>
));

const AddNewEntity = props => {
    const showLoginModal = () => {
        const modalID = 'myModal';
        document.getElementById(modalID).style.display = 'block';
        document.getElementById('modalRequestSection').style.display = 'none';
    };

    return (
        <Dropdown data-testid='addNewEntityDropdown' className='addNewEntityDropdown'>
            <Dropdown.Toggle as={CustomToggle} showLoginModal={showLoginModal} loggedIn={props.loggedIn}>
                + Add new
                <span className='addNewDropDownGap' />
                <ChevronBottom />
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} className='addNewEntityMenu'>
                <Dropdown.Item
                    href='/collection/add'
                    className='black-14'
                    data-testid='addNewCollection'
                    onClick={() => googleAnalytics.recordEvent('Collections', 'Add a new collection', 'Search bar add new link clicked')}>
                    Collection
                </Dropdown.Item>
                <Dropdown.Item
                    href='/course/add'
                    className='black-14'
                    data-testid='addNewCourse'
                    onClick={() => googleAnalytics.recordEvent('Courses', 'Add a new course', 'Search bar add new link clicked')}>
                    Course
                </Dropdown.Item>
                <Dropdown.Item
                    href='/paper/add'
                    className='black-14'
                    data-testid='addNewPaper'
                    onClick={() => googleAnalytics.recordEvent('Papers', 'Add a new paper', 'Search bar add new link clicked')}>
                    Paper
                </Dropdown.Item>
                <Dropdown.Item
                    href='/project/add'
                    className='black-14'
                    data-testid='addNewProject'
                    onClick={() => googleAnalytics.recordEvent('Projects', 'Add a new project', 'Search bar add new link clicked')}>
                    Project
                </Dropdown.Item>
                <Dropdown.Item
                    href='/tool/add'
                    className='black-14 '
                    data-testid='addNewTool'
                    onClick={() => googleAnalytics.recordEvent('Tools', 'Add a new tool', 'Search bar add new link clicked')}>
                    Tool
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default AddNewEntity;
