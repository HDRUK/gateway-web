import React, { Fragment } from 'react';
import SVGIcon from '../../../images/SVGIcon';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { SlideDown } from 'react-slidedown';
import { actionKeys } from '../../../utils/Workflows.util';

const WorkflowHeader = ({ workflowName, applications, applicationsClosed, toggleApplications, _id, onActionClick }) => {
    const renderApplications = applications.map(app => <li className='gray200-14'>{app.projectName}</li>);

    return (
        <div className='workflow-header'>
            <div className='workflow-title'>
                <h1>
                    <SVGIcon name='workflow' width={22} height={22} fill={'#3c4e8c'} /> {workflowName}
                </h1>
                {applications.length > 0 && (
                    <Fragment>
                        <div onClick={e => toggleApplications(_id)} className='pointer'>
                            This workflow is currently assigned to {applications.length} applications{' '}
                            <SVGIcon
                                name='chevronbottom'
                                width={16}
                                height={16}
                                fill={'#3c4e8c'}
                                className={applicationsClosed ? '' : 'flip180'}
                            />
                        </div>
                        <SlideDown closed={applicationsClosed}>
                            <div className='applications'>
                                <ul className='list-unstyled'>{renderApplications}</ul>
                            </div>
                        </SlideDown>
                    </Fragment>
                )}
            </div>
            <div className='workflow-action'>
                <DropdownButton title='Action' variant='outline-secondary'>
                    <Dropdown.Item eventKey='1' onClick={e => onActionClick(actionKeys.EDIT, _id)}>
                        Edit
                    </Dropdown.Item>
                    <Dropdown.Item eventKey='2' onClick={e => onActionClick(actionKeys.DELETE, _id)}>
                        Delete
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        </div>
    );
};

export default WorkflowHeader;
