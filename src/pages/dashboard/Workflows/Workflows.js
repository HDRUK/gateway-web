import React, { Fragment } from 'react';
import Workflow from './Workflow';
import WorkflowEmpty from './WorkflowEmpty';

const Workflows = props => {
    const { addWorkflow, workflows, toggleApplications, toggleSection, onActionClick } = props;

    return (
        <Fragment>
            <div className='row justify-content-md-center'>
                <div className='col-sm-12 col-md-10'>
                    <div className='main-card'>
                        <div className='main-header'>
                            <div className='main-header-desc'>
                                <div>
                                    <h1 className='black-20-semibold'>Workflows</h1>
                                </div>
                                <div className='soft-black-14'>
                                    Workflows are the frameworks used by your team to respond to data access requests.
                                </div>
                            </div>

                            <div className='main-header-action'>
                                <button className='button-primary' onClick={e => addWorkflow(e)}>
                                    + Add a new workflow
                                </button>
                            </div>
                        </div>
                        {/*MAIN-HEADER*/}
                    </div>
                    {/*MAIN-CARD*/}

                    {workflows.length > 0 ? (
                        workflows.map((workflow, i) => {
                            return (
                                <Workflow
                                    key={`workflow-${i}`}
                                    workflow={workflow}
                                    toggleApplications={toggleApplications}
                                    toggleSection={toggleSection}
                                    onActionClick={onActionClick}
                                />
                            );
                        })
                    ) : (
                        <WorkflowEmpty />
                    )}
                </div>
            </div>
        </Fragment>
    );
};

export default Workflows;
