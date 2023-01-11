import { useState, useEffect } from 'react';
import _ from 'lodash';
import axios from 'axios';
import PropTypes from 'prop-types';

import Workflows from './Workflows';
import AddEditWorkflow from './AddEditWorkflow';
import WorkflowModal from './WorkflowModal';
import Loading from '../../commonComponents/Loading';
import { baseURL } from '../../../configs/url.config';
import {
    toggleWorkflowStep,
    formatWorkflows,
    toggleWorkflowApplications,
    actionKeys,
    defaultWorkflow,
    defaultStep,
    defaultModal,
    modalactions,
    modalConfigWorkflow,
} from '../../../utils/Workflows.util';

const WorkflowDashboard = ({ userState, teamId }) => {
    const [user] = userState;
    const [loading, setLoading] = useState(false);
    const [workflows, setWorkflows] = useState([]);
    const [workflow, setWorkflow] = useState(defaultWorkflow);
    const [workflowId, setWorkflowId] = useState('');
    const [viewWorkflows, setViewWorkflows] = useState(true);
    const [modalConfig, setModalConfig] = useState(defaultModal);
    const [modalVisible, setModelVisible] = useState(false);

    const addWorkflow = e => {
        e.preventDefault();
        // set default workflow state
        setWorkflow(defaultWorkflow);
        // switch view
        setViewWorkflows(!viewWorkflows);
    };

    // TODO: GAT-1824 rewrite
    const getTeamById = () => {
        const team = localStorage.getItem('HDR_TEAM') || '';
        if (!_.isEmpty(user) && !_.isEmpty(team)) {
            const { teams = [] } = user;
            if (!_.isEmpty(teams)) {
                const teamObj = teams.find(to => to._id === team);
                if (!_.isEmpty(teamObj)) {
                    return teamObj._id;
                }
            }
        }
        return '';
    };

    const getWorkflows = async () => {
        if (!teamId) return;

        setLoading(true);

        await axios
            .get(`${baseURL}/api/v1/publishers/${teamId}/workflows`)
            .then(response => {
                const {
                    data: { workflows: workFlowsResponse },
                } = response;
                const workflowsArr = formatWorkflows(workFlowsResponse);
                setWorkflows(workflowsArr);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const toggleApplications = (_id = '') => {
        const toggledWorkflows = toggleWorkflowApplications(workflows, _id);
        setWorkflows(toggledWorkflows);
    };

    const toggleSection = (step = {}) => {
        const workflowsArray = toggleWorkflowStep(workflows, step);
        setWorkflows(workflowsArray);
    };

    const switchWorkflowView = () => {
        const switchViewWorkflows = !viewWorkflows;
        setViewWorkflows(switchViewWorkflows);
        if (switchViewWorkflows) getWorkflows();
    };

    const toggleModal = async (type = '', action = '') => {
        // 1. get basic modal config
        if (!_.isEmpty(type)) {
            const config = modalConfigWorkflow(type);
            setModalConfig(config);
            // 4. show / hide modal
            setModelVisible(!modalVisible);
        }

        if (!_.isEmpty(action)) {
            const { actionName = 'cancel' } = action;
            const formattedActionName = actionName.toUpperCase();

            if (formattedActionName === modalactions.DELETEWORKFLOW) {
                await axios.delete(`${baseURL}/api/v1/workflows/${workflowId}`);
                setWorkflowId('');
                getWorkflows();
                setModelVisible(!modalVisible);
                return;
            }

            if (formattedActionName === modalactions.CANCEL) {
                setModelVisible(!modalVisible);
                return;
            }

            setModelVisible(false);
        }
    };

    const mapWorkflowSteps = steps => {
        return [...steps].map(el => {
            const reviewers = [...el.reviewers].map(r => r._id);
            return {
                ...el,
                reviewers,
            };
        });
    };

    const onActionClick = async (key, _id) => {
        if (!_.isEmpty(_id)) {
            const updatedWorkflow = workflows.find(el => el._id === _id);
            const { canEdit, canDelete, steps } = updatedWorkflow;
            if (key === actionKeys.EDIT) {
                if (canEdit) {
                    const wfSteps = mapWorkflowSteps(steps);

                    setWorkflow({
                        ...updatedWorkflow,
                        steps: wfSteps,
                    });
                    setViewWorkflows(false);
                } else {
                    toggleModal(modalactions.CANNOTEDITWORKFLOW);
                }
            }
            if (key === actionKeys.DELETE) {
                if (!canDelete) {
                    toggleModal(modalactions.CANNOTDELETEWORKFLOW);
                } else {
                    setWorkflowId(_id);
                    toggleModal(modalactions.DELETEWORKFLOW);
                }
            }
        }
    };

    const updateWorkflow = updatedWorkflow => {
        if (!_.isEmpty(updatedWorkflow)) {
            setWorkflow(updatedWorkflow);
        }
    };

    useEffect(() => {
        getWorkflows();
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {loading && <Loading />}
            {!loading &&
                (viewWorkflows ? (
                    <Workflows
                        workflows={workflows}
                        addWorkflow={addWorkflow}
                        toggleApplications={toggleApplications}
                        toggleSection={toggleSection}
                        onActionClick={onActionClick}
                    />
                ) : (
                    <AddEditWorkflow
                        step={defaultStep}
                        workflow={workflow}
                        team={teamId}
                        switchWorkflowView={switchWorkflowView}
                        updateWorkflow={updateWorkflow}
                    />
                ))}

            <WorkflowModal open={modalVisible} context={modalConfig} close={toggleModal} />
        </>
    );
};

WorkflowDashboard.propTypes = {
    userState: PropTypes.arrayOf(
        PropTypes.shape({
            user: PropTypes.shape({
                teams: PropTypes.arrayOf({ _id: PropTypes.number }),
            }),
        })
    ).isRequired,
    teamId: PropTypes.number.isRequired,
};

export default WorkflowDashboard;
