import React from 'react';
import WorkflowHeader from './WorkflowHeader';
import WorkflowStep from './WorkflowStep';

const Workflow = ({ workflow, toggleApplications, toggleSection, onActionClick }) => {
    const { workflowName, applicationsClosed, applications, steps, _id } = workflow;

    return (
        <div className='workflow-card'>
            <WorkflowHeader
                _id={_id}
                workflowName={workflowName}
                applicationsClosed={applicationsClosed}
                applications={applications}
                toggleApplications={toggleApplications}
                onActionClick={onActionClick}
            />
            <WorkflowStep steps={steps} toggleSection={toggleSection} />
        </div>
    );
};

export default Workflow;
