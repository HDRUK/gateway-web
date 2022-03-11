import * as Sentry from '@sentry/react';
import { isArray, isEmpty } from 'lodash';
import moment from 'moment';
import React, { createRef, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import dataUseRegistersService from '../../../services/data-use-registers';
import datasetsService from '../../../services/datasets';
import papersService from '../../../services/papers';
import searchService from '../../../services/search';
import toolsService from '../../../services/tools';
import usersService from '../../../services/users';
import DataSetModal from '../../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../../commonComponents/errorModal/ErrorModal';
import Loading from '../../commonComponents/Loading';
import SearchBar from '../../commonComponents/searchBar/SearchBar';
import SideDrawer from '../../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../../commonComponents/userMessages/UserMessages';
import EditFormDataUse from './EditDataUseForm';

const EditDataUse = props => {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchBar] = useState(createRef());
    const [searchString, setSearchString] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [context, setContext] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [keywords, setKeywords] = useState([]);
    const [datasetData, setDatasetData] = useState([]);
    const [toolData, setToolData] = useState([]);
    const [datauseData, setDatauseData] = useState([]);
    const [paperData, setPaperData] = useState([]);
    const [personData, setPersonData] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [summary, setSummary] = useState([]);
    const [tempRelatedObjectIds, setTempRelatedObjectIds] = useState([]);
    const [relatedObjects, setRelatedObjects] = useState([]);
    const [didDelete, setDidDelete] = useState(false);
    const [safeOuputsArray, setSafeOuputsArray] = useState(['']);
    const [safeOuputsToolList, setSafeOuputsToolList] = useState([]);
    const [safeOuputsPaperList, setSafeOuputsPaperList] = useState([]);
    const [applicantsArray, setApplicantsArray] = useState(['']);
    const [applicantsList, setApplicantsList] = useState([]);
    const [datasetsArray, setDatasetsArray] = useState(['']);
    const [datasetsList, setDatasetsList] = useState([]);
    const [disableInput, setDisableInput] = useState(false);
    const [userState] = useState(
        props.userState || [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ]
    );

    const dataUseRegistersRequest = dataUseRegistersService.useGetDataUseRegisters(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const dataUseRegisterRequest = dataUseRegistersService.useGetDataUseRegister(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const usersRequest = usersService.useGetUsers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const toolsRequest = toolsService.useGetTools(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const papersRequest = papersService.useGetPapers(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const datasetsRequest = datasetsService.useGetDatasets(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const searchRequest = searchService.useGetSearch(null, {
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);

            await Promise.all([
                doGetKeywordsCall(),
                doGetUsersCall(),
                doGetDatasetsCall(),
                doGetSafeOutputsToolCall(),
                doGetSafeOutputsPaperCall(),
            ]);

            dataUseRegisterRequest.mutateAsync(props.match.params.datauseID).then(res => {
                setData(res.data);
                setRelatedObjects(res.data.relatedObjects ? res.data.relatedObjects : []);

                const safeOutputs = [];
                res.data.gatewayOutputsPapersInfo.forEach(output => {
                    safeOutputs.push({ id: output.id, name: output.name });
                });

                res.data.gatewayOutputsToolsInfo.forEach(output => {
                    safeOutputs.push({ id: output.id, name: output.name });
                });

                res.data.nonGatewayOutputs.forEach(output => {
                    safeOutputs.push({ id: 'nonGateway', name: output });
                });

                setSafeOuputsArray(!isEmpty(safeOutputs) ? safeOutputs : [{ id: '', name: '' }]);

                const applicants = [];

                res.data.gatewayApplicants.forEach(gatewayApplicant => {
                    applicants.push({ id: gatewayApplicant.id, name: `${gatewayApplicant.firstname} ${gatewayApplicant.lastname}` });
                });

                res.data.nonGatewayApplicants.forEach(nonGatewayApplicant => {
                    applicants.push({ id: 'nonGateway', name: nonGatewayApplicant });
                });

                setApplicantsArray(!isEmpty(applicants) ? applicants : []);

                const datasets = [];

                res.data.gatewayDatasetsInfo.forEach(gatewayDataset => {
                    if (isArray(gatewayDataset)) {
                        datasets.push({ pid: gatewayDataset[0].pid, name: gatewayDataset[0].name });
                    } else {
                        datasets.push({ pid: gatewayDataset.pid, name: gatewayDataset.name });
                    }
                });

                res.data.nonGatewayDatasets.forEach(nonGatewayDataset => {
                    datasets.push({ pid: 'nonGateway', name: nonGatewayDataset });
                });

                setDatasetsArray(!isEmpty(datasets) ? datasets : [{ pid: '', name: '' }]);

                setDisableInput(getUserRoles(res.data.publisher));
                setIsLoading(false);
            });
        };

        init();
    }, []);

    const getUserRoles = publisher => {
        const { teams } = userState[0];
        const foundTeam = teams.filter(team => team._id === publisher);
        if (isEmpty(teams) || isEmpty(foundTeam)) {
            return true;
        }

        return !foundTeam[0].roles.some(role => ['manager', 'reviewer'].includes(role));
    };

    const doGetUsersCall = () =>
        usersRequest.refetch().then(res => {
            setApplicantsList(res.data.data.data);
        });

    const doGetDatasetsCall = () =>
        datasetsRequest
            .mutateAsync({
                params: {
                    activeflag: 'active',
                    fields: 'pid,name,',
                },
            })
            .then(res => {
                setDatasetsList(res.data.datasets);
            });

    const doGetSafeOutputsToolCall = () =>
        toolsRequest
            .mutateAsync({
                params: {
                    activeflag: 'active',
                    fields: 'id,name,',
                },
            })
            .then(res => {
                setSafeOuputsToolList(res.data.data);
            });

    const doGetSafeOutputsPaperCall = () =>
        papersRequest
            .mutateAsync({
                params: {
                    activeflag: 'active',
                    fields: 'id,name,',
                },
            })
            .then(res => {
                setSafeOuputsPaperList(res.data.data);
            });

    let showError = false;

    const showModalHandler = () => {
        showError = true;
    };

    const hideModalHandler = props => {
        showError = false;
    };

    const doSearch = e => {
        // fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
    };

    const updateSearchString = searchString => {
        setSearchString(searchString);
    };

    const doModalSearch = (e, type = 'dataset', page = 0) => {
        if (e.key === 'Enter' || e === 'click') {
            let searchURL = '';

            if (type === 'dataset' && page > 0) searchURL += `&datasetIndex=${page}`;
            if (type === 'tool' && page > 0) searchURL += `&toolIndex=${page}`;
            if (type === 'paper' && page > 0) searchURL += `&paperIndex=${page}`;
            if (type === 'person' && page > 0) searchURL += `&personIndex=${page}`;
            if (type === 'course' && page > 0) searchURL += `&courseIndex=${page}`;

            searchRequest
                .mutateAsync({
                    params: {
                        search: encodeURIComponent(searchString) + searchURL,
                        form: true,
                        userID: userState[0].id,
                    },
                })
                .then(res => {
                    setDatasetData(res.data.datasetResults || []);
                    setToolData(res.data.toolResults || []);
                    setDatauseData(res.data.dataUseRegisterResults || []);
                    setPaperData(res.data.paperResults || []);
                    setPersonData(res.data.personResults || []);
                    setCourseData(res.data.courseResults || []);
                    setSummary(res.data.summary || []);
                    setIsLoading(false);
                });
        }
    };

    const addToTempRelatedObjects = (id, type, pid) => {
        let updatedTempRelatedObjectIds = [...tempRelatedObjectIds];
        if (tempRelatedObjectIds && tempRelatedObjectIds.some(object => object.objectId === id)) {
            updatedTempRelatedObjectIds = updatedTempRelatedObjectIds.filter(object => object.objectId !== id);
        } else {
            updatedTempRelatedObjectIds.push({ objectId: id, objectType: type, pid });
        }
        setTempRelatedObjectIds(updatedTempRelatedObjectIds);
    };

    const addToRelatedObjects = () => {
        const relatedObjectIds = [...tempRelatedObjectIds];

        const newRelatedObjects = relatedObjectIds.map(relatedObject => {
            const newRelatedObject = {
                ...relatedObject,
                objectId: relatedObject.type === 'dataset' ? relatedObject.pid : relatedObject.objectId,
                user: userState.name,
                updated: moment().format('DD MMM YYYY'),
            };
            return newRelatedObject;
        });
        setRelatedObjects([...relatedObjects, ...newRelatedObjects]);
        setTempRelatedObjectIds([]);
    };

    const clearRelatedObjects = () => {
        setTempRelatedObjectIds([]);
    };

    const removeObject = (id, type, datasetid) => {
        const countOfRelatedObjects = relatedObjects.length;
        let newRelatedObjects = [...relatedObjects].filter(obj => obj.objectId !== id && obj.objectId !== id.toString() && obj.pid !== id);

        // if an item was not removed try removing by datasetid for retro linkages
        if (countOfRelatedObjects <= newRelatedObjects.length && type === 'dataset') {
            newRelatedObjects = [...relatedObjects].filter(obj => obj.objectId !== datasetid && obj.objectId !== datasetid.toString());
        }
        setRelatedObjects(newRelatedObjects);
        setDidDelete(true);
    };

    const updateDeleteFlag = () => {
        setDidDelete(false);
    };

    const toggleDrawer = () => {
        if (showDrawer === true) {
            searchBar.current.getNumberOfUnreadMessages();
        }
        setShowDrawer(!showDrawer);
    };

    const toggleModal = (showEnquiry = false, context = {}) => {
        setShowModal(!showModal);
        setContext(context);
        setShowDrawer(showEnquiry);
    };

    const doGetKeywordsCall = () =>
        dataUseRegistersRequest
            .mutateAsync({
                params: {
                    activeflag: 'active',
                    fields: 'keywords,',
                },
            })
            .then(res => {
                const tempKeywordsArray = [];

                res.data.data.forEach(keywordsArray => {
                    if (keywordsArray.keywords) {
                        keywordsArray.keywords.forEach(keywords => {
                            if (!tempKeywordsArray.includes(keywords) && keywords !== '') {
                                tempKeywordsArray.push(keywords);
                            }
                        });
                    }
                });

                setKeywords(
                    tempKeywordsArray.sort((a, b) => (a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0))
                );
            });

    if (isLoading) {
        return (
            <Container>
                <Loading data-testid='outerLoadingSpinner' />
            </Container>
        );
    }

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal show={showModalHandler} handleClose={hideModalHandler} />}>
            <div>
                <SearchBar
                    ref={searchBar}
                    searchString={searchString}
                    doSearchMethod={doSearch}
                    doUpdateSearchString={updateSearchString}
                    userState={userState}
                />

                <EditFormDataUse
                    data={data}
                    userState={userState}
                    keywordsData={keywords}
                    doToggleDrawer={toggleDrawer}
                    doSearchMethod={doModalSearch}
                    doUpdateSearchString={updateSearchString}
                    datasetData={datasetData}
                    toolData={toolData}
                    datauseData={datauseData}
                    paperData={paperData}
                    personData={personData}
                    courseData={courseData}
                    summary={summary}
                    doAddToTempRelatedObjects={addToTempRelatedObjects}
                    tempRelatedObjectIds={tempRelatedObjectIds}
                    doClearRelatedObjects={clearRelatedObjects}
                    doAddToRelatedObjects={addToRelatedObjects}
                    doRemoveObject={removeObject}
                    relatedObjects={relatedObjects}
                    didDelete={didDelete}
                    updateDeleteFlag={updateDeleteFlag}
                    safeOuputsArray={safeOuputsArray}
                    safeOuputsList={[...safeOuputsToolList, ...safeOuputsPaperList]}
                    applicantsArray={applicantsArray}
                    applicantsList={applicantsList}
                    datasetsArray={datasetsArray}
                    datasetsList={datasetsList}
                    disableInput={disableInput}
                />
                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={toggleDrawer} />
                </SideDrawer>

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
            </div>
        </Sentry.ErrorBoundary>
    );
};

export default EditDataUse;
