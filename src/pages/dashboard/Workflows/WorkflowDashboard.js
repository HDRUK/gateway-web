import React, { Fragment, useState, useEffect } from 'react';
import _ from 'lodash';
import Workflows from './Workflows';
import AddEditWorkflow from './AddEditWorkflow';
import WorkflowModal from './WorkflowModal';
import axios from 'axios';
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

const WorkflowDashboard = ({ userState, team }) => {
    const [user] = userState;
    const [loading, setLoading] = useState(true);
    const [workflows, setWorkflows] = useState([]);
    const [workflow, setWorkflow] = useState(defaultWorkflow);
    const [workflowId, setWorkflowId] = useState('');
    const [teamId, setTeamId] = useState('');
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

    const getTeamById = () => {
        const team = localStorage.getItem('HDR_TEAM') || '';
        if (!_.isEmpty(user) && !_.isEmpty(team)) {
            let { teams = [] } = user;
            if (!_.isEmpty(teams)) {
                const teamObj = teams.find(to => to._id === team);
                if (!_.isEmpty(teamObj)) {
                    return teamObj._id;
                }
            }
        }
        return '';
    };

    const getWorkflows = async (teamId = '') => {
        await axios
            .get(`${baseURL}/api/v1/publishers/${teamId}/workflows`)
            .then(response => {
                let {
                    data: { workflows },
                } = response;
                const workflowsArr = formatWorkflows(workflows);
                setWorkflows(workflowsArr);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.error(err.message);
            });
    };

    const toggleApplications = (_id = '') => {
        const workflow = toggleWorkflowApplications(workflows, _id);
        setWorkflows(workflow);
    };

    const toggleSection = (step = {}) => {
        const workflowsArray = toggleWorkflowStep(workflows, step);
        setWorkflows(workflowsArray);
    };

    const switchWorkflowView = () => {
        let switchViewWorkflows = !viewWorkflows;
        setViewWorkflows(switchViewWorkflows);
        if (switchViewWorkflows) getWorkflows();
    };

    const onActionClick = async (key, _id) => {
        let workflow = {};
        if (!_.isEmpty(_id)) {
            workflow = workflows.find(el => el._id === _id);
            let { canEdit, canDelete, steps } = workflow;
            switch (key) {
                case actionKeys.EDIT:
                    if (canEdit) {
                        let wfSteps = mapWorkflowSteps(steps);
                        workflow = {
                            ...workflow,
                            steps: wfSteps,
                        };
                        setWorkflow(workflow);
                        setViewWorkflows(false);
                    } else {
                        toggleModal(modalactions.CANNOTEDITWORKFLOW);
                    }
                    break;
                case actionKeys.DELETE:
                    if (!canDelete) {
                        toggleModal(modalactions.CANNOTDELETEWORKFLOW);
                    } else {
                        setWorkflowId(_id);
                        toggleModal(modalactions.DELETEWORKFLOW);
                    }
                    break;
                default:
                    return '';
            }
        }
    };

    const mapWorkflowSteps = steps => {
        return [...steps].map(el => {
            let reviewers = [...el.reviewers].map(r => r._id);
            return {
                ...el,
                reviewers,
            };
        });
    };

    const updateWorkflow = workflow => {
        if (!_.isEmpty(workflow)) {
            setWorkflow(workflow);
        }
    };

    const toggleModal = async (type = '', action = '') => {
        // 1. get basic modal config
        if (!_.isEmpty(type)) {
            let config = modalConfigWorkflow(type);
            setModalConfig(config);
            // 4. show / hide modal
            setModelVisible(!modalVisible);
        }

        if (!_.isEmpty(action)) {
            let { actionName = 'cancel' } = action;
            switch (actionName.toUpperCase()) {
                case modalactions.DELETEWORKFLOW:
                    await axios.delete(`${baseURL}/api/v1/workflows/${workflowId}`);
                    setWorkflowId('');
                    getWorkflows(teamId);
                    setModelVisible(!modalVisible);
                    break;
                case modalactions.CANCEL:
                    setModelVisible(!modalVisible);
                    break;
                default:
                    setModelVisible(false);
                    break;
            }
        }
    };

    useEffect(() => {
        let teamId = getTeamById();
        setTeamId(teamId);
        setLoading(true);
        getWorkflows(teamId);
        window.scrollTo(0, 0);
    }, [team, viewWorkflows, getTeamById()]);

    return (
        <Fragment>
            {loading ? (
                <Loading />
            ) : viewWorkflows ? (
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
                    user={user}
                    team={teamId}
                    switchWorkflowView={switchWorkflowView}
                    updateWorkflow={updateWorkflow}
                />
            )}

            <WorkflowModal open={modalVisible} context={modalConfig} close={toggleModal} />
        </Fragment>
    );
};

export default WorkflowDashboard;
