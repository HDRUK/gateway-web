import _ from 'lodash';
import moment from 'moment';
import randomstring from 'randomstring';
import i18n from 'i18next';

let autoCompleteLookUps = { fullname: ['orcid', 'email', 'bio'] };

let userTypes = {
	CUSTODIAN: 'custodian',
	APPLICANT: 'applicant',
};

let amendmentStatuses = {
	AWAITINGUPDATES: { text: 'Awaiting updates', icon: 'cycle' },
	UPDATESSUBMITTED: { text: 'Updates submitted', icon: 'check' },
	UPDATESREQUESTED: { text: 'Updates requested', icon: 'flag' },
	UPDATESRECEIVED: { text: 'Updates received', icon: 'flag' },
};

let staticContent = {
	aboutPageNav: {
		pageId: 'about',
		active: true,
		title: 'Before you begin',
		description:
			'Preparation is key to a successful data access request. You need to be able to demonstrate how you will ensure safe use of patient data and the potential for public benefit. The steps below are intended to help you get off to a good start.',
	},
	aboutPanel: {
		panelId: 'about',
		index: 0,
		pageId: 'about',
	},
	filesNav: {
		pageId: 'files',
		active: false,
		title: 'Files',
		description:
			'Applicant should add any files requested here, as well as any additional files that could support the application. A description should be included to clarify the purpose of each document.',
	},
	filesPanel: {
		panelId: 'files',
		index: 100,
		pageId: 'files',
	},
	beforeYouBeginPageNav: {
		pageId: 'beforeYouBegin',
		active: true,
		title: 'Before you begin',
		description:
			'The guidance below gives you a quick overview of the process of adding datasets to the Gateway. Guidance on each field is also provided throughout the form.',
	},
	beforeYouBeginPanel: {
		panelId: 'beforeYouBegin',
		index: 0,
		pageId: 'beforeYouBegin',
	},
	structuralPageNav: {
		pageId: 'structural',
		active: false,
		title: 'Structural metadata',
		description:
			'Applicant should add any files requested here, as well as any additional files that could support the application. A description should be included to clarify the purpose of each document.',
	},
	structuralPanel: {
		panelId: 'structural',
		index: 100,
		pageId: 'structural',
	},
};

let darCommentTitle = {
	approved: 'Conditions',
	'approved with conditions': 'Conditions',
	rejected: 'Reason for rejection',
};

let datasetStatus = {
	draft: 'draft',
	archive: 'archive',
	inReview: 'inReview',
	active: 'active',
	rejected: 'rejected',
	'approved with conditions': 'approved',
};

let datasetSLAText = {
	draft: 'Draft',
	archive: 'Archived',
	inReview: 'In review',
	active: 'Live',
	rejected: 'Rejected',
};

let datasetStatusColours = {
	draft: 'gray',
	archive: 'gray',
	inReview: 'amber',
	active: 'green',
	rejected: 'red',
};

/**
 * [applicationState acts like enum for generating Counts DAR dashboard]
 *
 */
let darStatusCounts = {
	all: 'allCount',
	inProgress: 'preSubmissionCount',
	submitted: 'submittedCount',
	inReview: 'inReviewCount',
	approved: 'approvedCount',
	'approved with conditions': 'approvedCount',
	rejected: 'rejectedCount',
};

let darStaticPageIds = {
	ABOUT: 'about',
	FILES: 'files',
	BEFOREYOUBEGIN: 'beforeYouBegin',
	STRUCTURAL: 'structural',
};

let actionKeys = {
	GUIDANCE: 'guidance',
	REQUESTAMENDMENT: 'requestAmendment',
	CANCELREQUEST: 'cancelRequest',
	REVERTTOPREVIOUSANSWER: 'revertToPreviousAnswer',
};

const amendmentModes = {
	ADDED: 'added',
	REMOVED: 'removed',
	REVERTED: 'reverted',
};

const flagIcons = {
	WARNING: 'fas fa-exclamation-circle warning',
	SUCCESS: 'fas fa-check success',
	DANGER: 'fas fa-exclamation-circle danger',
};

const flagPanelIcons = {
	WARNING: 'fas fa-circle warning',
	SUCCESS: 'fas fa-check success',
	DANGER: 'fas fa-circle danger',
};

/**
 * [generateStatusCounts - Used in DataAccessRequest Dashboard for status counts]
 *
 * @param   {[data]}}  [DAR Objects]
 * @return  {{counts}} [return counts]
 */
let generateStatusCounts = (data = []) => {
	// 1. declare obj structure even if no data
	let counts = {
		allCount: 0,
		approvedCount: 0,
		rejectedCount: 0,
		archivedCount: 0,
		preSubmissionCount: 0,
		inReviewCount: 0,
		submittedCount: 0,
	};

	if (!_.isEmpty(data)) {
		// 2. reduce over data from API to generate structure as above counts
		let totalCounts = [...data].reduce((obj, item, i) => {
			// 3. take out applicationStatus ie, inProgress, submitted etc..
			let { applicationStatus } = item;
			// 4. if the applicationStatus not in our obj, set to 1 with key
			if (!obj[darStatusCounts[applicationStatus]]) {
				obj[darStatusCounts[applicationStatus]] = 1;
			} else {
				// 5. if found increment the count
				obj[darStatusCounts[applicationStatus]] = ++obj[darStatusCounts[applicationStatus]];
			}
			obj['allCount'] = ++i;
			// 6. return obj as count format
			return obj;
		}, {});
		return { ...counts, ...totalCounts };
	}
	// 7. return counts as default
	return counts;
};

let configActionModal = (type = '') => {
	let config = {};
	if (!_.isEmpty(type)) {
		switch (type.toUpperCase()) {
			case 'VALIDATIONERRORS':
				config = {
					title: i18n.t('dataset.validationErrosModal.title'),
					subTitle: i18n.t('dataset.validationErrosModal.description'),
					link: 'https://hdruk.atlassian.net/servicedesk/customer/portal/1',
					description: false,
					buttons: {
						confirmSubmission: {
							label: i18n.t('dataset.validationErrosModal.buttons.confirm'),
							action: 'cancel',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'VALIDATIONERRORSADMIN':
				config = {
					title: i18n.t('dataset.validationErrosAdminModal.title'),
					subTitle: i18n.t('dataset.validationErrosAdminModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.validationErrosAdminModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.validationErrosAdminModal.buttons.confirm'),
							action: 'confirmSubmission',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'SUBMITFORREVIEW':
				config = {
					title: i18n.t('dataset.submitForReviewModal.title'),
					subTitle: i18n.t('dataset.submitForReviewModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.submitForReviewModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.submitForReviewModal.buttons.confirm'),
							action: 'confirmSubmission',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'CREATENEWVERSION':
				config = {
					title: i18n.t('dataset.createNewVersionModal.title'),
					subTitle: i18n.t('dataset.createNewVersionModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.createNewVersionModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.createNewVersionModal.buttons.confirm'),
							action: 'confirmNewVersion',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'ARCHIVE':
				config = {
					title: i18n.t('dataset.archiveModal.title'),
					subTitle: i18n.t('dataset.archiveModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.archiveModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.archiveModal.buttons.confirm'),
							action: 'archive',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'UNARCHIVE':
				config = {
					title: i18n.t('dataset.unArchiveModal.title'),
					subTitle: i18n.t('dataset.unArchiveModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.unArchiveModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.unArchiveModal.buttons.confirm'),
							action: 'unarchive',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'APPROVE':
				config = {
					title: i18n.t('dataset.approvalModal.title'),
					subTitle: i18n.t('dataset.approvalModal.description'),
					description: true,
					buttons: {
						cancel: {
							label: i18n.t('dataset.approvalModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmApproval: {
							label: i18n.t('dataset.approvalModal.buttons.confirm'),
							action: 'confirmApproval',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'REJECT':
				config = {
					title: i18n.t('dataset.rejectModal.title'),
					subTitle: i18n.t('dataset.rejectModal.description'),
					description: true,
					buttons: {
						cancel: {
							label: i18n.t('dataset.rejectModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmReject: {
							label: i18n.t('dataset.rejectModal.buttons.confirm'),
							action: 'confirmRejection',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'APPROVEWITHCONDITIONS':
				config = {
					title: i18n.t('dataset.approveWithConditionsModal.title'),
					subTitle: i18n.t('dataset.approveWithConditionsModal.description'),
					description: true,
					buttons: {
						cancel: {
							label: i18n.t('dataset.approveWithConditionsModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmApprovalConditions: {
							label: i18n.t('dataset.approveWithConditionsModal.buttons.confirm'),
							action: 'confirmApprovalConditions',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'DELETEDRAFT':
				config = {
					title: i18n.t('dataset.deleteDraftModal.title'),
					subTitle: i18n.t('dataset.deleteDraftModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.deleteDraftModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmDelete: {
							label: i18n.t('dataset.deleteDraftModal.buttons.confirm'),
							action: 'deleteDraft',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			case 'DUPLICATE':
				config = {
					title: i18n.t('dataset.duplicateModal.title'),
					subTitle: i18n.t('dataset.duplicateModal.description'),
					description: false,
					buttons: {
						cancel: {
							label: i18n.t('dataset.duplicateModal.buttons.cancel'),
							action: 'cancel',
							class: 'button-secondary mr-2',
						},
						confirmSubmission: {
							label: i18n.t('dataset.duplicateModal.buttons.confirm'),
							action: 'duplicate',
							class: 'btn btn-primary addButton',
						},
					},
				};
				break;
			default:
				return type;
		}
	}

	return config;
};

let autoComplete = (questionId, uniqueId, questionAnswers) => {
	let questionList = {};
	let lookupArr = [...autoCompleteLookUps[`${questionId}`]];
	let activeQuestionId = typeof uniqueId !== 'undefined' ? `${questionId}_${uniqueId}` : questionId;
	let answerObj = questionAnswers[`${activeQuestionId}`];

	lookupArr.map(val => {
		let key, value;
		value = answerObj[val] || '';
		key = val;
		if (typeof uniqueId !== 'undefined') key = `${key}_${uniqueId}`;

		questionList = {
			...questionList,
			[`${key}`]: value,
		};
	});
	// return questionAnswers
	return { ...questionAnswers, ...questionList };
};

let questionSetToDuplicate = (questionSetId, schema, uniqueID) => {
	let { questionSets } = schema;
	// 1. find questionSet
	let qSet = findQuestionSet(questionSetId, schema);
	if (!_.isEmpty(qSet)) {
		// 2. find the questionSet to duplicate for the qSet
		let {
			questions: [question],
		} = { ...qSet };
		// 3. duplicate questionSet ensure we take a copy
		let qSetDuplicate = [...questionSets].find(q => q.questionSetId === question.input.panelId);
		// 5. modify the questions array questionIds
		let qSetModified = modifyQuestionIds(qSetDuplicate, uniqueID);
		// 6. return the modified questionSet
		return qSetModified;
	}
	return {};
};

let modifyQuestionIds = (questionSet, existingUniqueId) => {
	let { questionSetId, questions } = { ...questionSet };
	let uniqueId = randomstring.generate(5);
	if (!_.isEmpty(existingUniqueId)) uniqueId = existingUniqueId;
	questionSetId = `${questionSetId}_${uniqueId}`;
	// 1.loop over each qObj and if questionId update
	let questionsModified = [...questions].reduce((arr, qValue) => {
		// 2. ensure we copy the original question deep
		let question = _.cloneDeep(qValue);
		// 3. if there is a questionId update
		if (!_.isUndefined(question.questionId)) {
			question.questionId = `${qValue.questionId}_${uniqueId}`;
		}
		// 4. if qObj has input and input.options meaning potential nest, loop over nested options
		if (typeof question.input === 'object' && typeof question.input.options !== 'undefined') {
			modifyNestedQuestionIds([...question.input.options], uniqueId);
		}
		return [...arr, question];
	}, []);

	questionsModified = [
		...questionsModified,
		{
			// panelId to be dynamically passed in **HARDCODED*** action must be remove***
			input: {
				type: 'buttonInput',
				action: 'removeObservation',
				panelId: `observations`,
				text: 'Remove observation',
				class: 'btn btn-light',
			},
			question: '',
			questionId: `removeObservation_${uniqueId}`,
		},
	];
	return {
		...questionSet,
		questionSetId: questionSetId,
		questions: questionsModified,
	};
};

let modifyNestedQuestionIds = (questionsArr, uniqueId) => {
	let child;
	let qArr = [...questionsArr];

	if (!questionsArr) return;

	for (let questionObj of qArr) {
		// 1. test each option obj if have conditionals and a length
		if (typeof questionObj.conditionalQuestions !== 'undefined' && questionObj.conditionalQuestions.length > 0) {
			// 2. for each option in conditional questions loop
			questionObj.conditionalQuestions.forEach(option => {
				// 3. test if option has a questionId and if so modify
				if (!_.isUndefined(option.questionId)) {
					option['questionId'] = `${option.questionId}_${uniqueId}`;
				}
				// 4. test the input for options and if options defined means it is another recursive loop call
				if (typeof questionObj.input === 'object' && typeof questionObj.input.options !== 'undefined') {
					child = modifyNestedQuestionIds(option.conditionalQuestions, uniqueId);
				}
			});
		}
		// 5. return recursive call
		if (child) return child;
	}
};

let insertSchemaUpdates = (questionSetId, duplicateQuestionSet, schema) => {
	let { questionPanels, questionSets } = { ...schema };
	// 1. update the questionSets with our new duplicatedQuestion
	questionSets = [...questionSets, duplicateQuestionSet];

	let qSet = findQuestionSet(questionSetId, schema);

	if (!_.isEmpty(qSet)) {
		// 2. find the questionSet to duplicate for the qSet
		let {
			questions: [question],
		} = qSet;
		// 3. get the questionSetId that we need to insert into our questionPanel
		if (!_.isUndefined(question.input.panelId)) {
			let {
				input: { panelId },
			} = question;
			// 4. find question panel
			let questionPanel = findQuestionPanel(panelId, questionPanels) || {};
			if (!_.isEmpty(questionPanel)) {
				let { questionSets } = questionPanel;
				// 5. new questionSet to be pushed
				let questionSet = {
					index: 5,
					questionSetId: duplicateQuestionSet.questionSetId,
				};
				let idx = questionSets.length - 1;
				// 6. push into preliminary position
				questionSets.splice(idx, 0, questionSet);
			}
			return {
				...schema,
				questionSets,
				questionPanels,
			};
		}
	}
	return { ...schema };
};

let removeQuestionReferences = (questionSetId, questionId, schema) => {
	let questionSet, question;
	let { questionPanels, questionSets } = { ...schema };
	// 1. find questionSet in questionSets
	questionSet = findQuestionSet(questionSetId, schema);
	// 2. find the question in questionSet
	question = findQuestion(questionId, questionSet);
	if (!_.isEmpty(question)) {
		// 3. extract panelId
		let {
			input: { panelId },
		} = question;
		// 4. remove from questionSet
		questionSets = questionSets.filter(qs => {
			return qs.questionSetId !== questionSetId;
		});
		// 5. remove from questionPanel
		questionPanels = questionPanels.map(questionSetObj => {
			return removeQuestionSet(questionSetObj, panelId, questionSetId);
		});
		// 6. return new schema
		return {
			...schema,
			questionPanels,
			questionSets,
		};
	}
	return schema;
};

let removeQuestionAnswers = (questionId = '', questionAnswers = {}) => {
	if (!_.isEmpty(questionId) && !_.isEmpty(questionAnswers)) {
		let [id] = questionId.split('_');
		if (typeof id != 'undefined') {
			Object.keys(questionAnswers).forEach(key => {
				if (key.includes(id)) {
					questionAnswers[key] = '';
				}
			});
		}
	}
	return questionAnswers;
};

let findQuestion = (questionId = '', questionSet = []) => {
	if (!_.isEmpty(questionId) && !_.isEmpty(questionSet)) {
		let { questions } = questionSet;
		if (!_.isEmpty(questions)) {
			return questions.find(q => q.questionId === questionId);
		}
	}
	return {};
};

let findQuestionSet = (questionSetId = '', schema = {}) => {
	if (!_.isEmpty(questionSetId) && !_.isEmpty(schema)) {
		let { questionSets } = schema;
		return [...questionSets].find(q => q.questionSetId === questionSetId);
	}
	return {};
};

let findQuestionPanel = (panelId = '', questionPanels = []) => {
	if (!_.isEmpty(panelId) && !_.isEmpty(questionPanels)) {
		return [...questionPanels].find(qp => qp.panelId === panelId) || {};
	}
	return {};
};

let removeQuestionSet = (questionSetObj = {}, panelId = '', questionSetId = '') => {
	if (questionSetObj.panelId === panelId) {
		const items = questionSetObj.questionSets.filter(qs => {
			return qs.questionSetId !== questionSetId;
		});
		questionSetObj.questionSets = items;

		return questionSetObj;
	}

	return questionSetObj;
};

let getCompletionPercentages = component => {
	var updatedCompletion = _.cloneDeep(component.state.completion);

	const formPanels = [...component.state.jsonSchema.formPanels];
	let listOfPanelsWithParent = [];

	formPanels.forEach(val => {
		let countObj = totalQuestionsAnswered(component, val.panelId);
		if (countObj.totalQuestions !== 0)
			updatedCompletion[val.panelId] = Math.round((countObj.totalAnsweredQuestions / countObj.totalQuestions) * 100);
		if (val.panelId !== val.pageId)
			listOfPanelsWithParent.push({
				parent: val.pageId,
				totalAnswered: countObj.totalAnsweredQuestions,
				totalQuestions: countObj.totalQuestions,
			});
	});

	let parentPanels = [];
	listOfPanelsWithParent.forEach(item => {
		if (!parentPanels.find(x => x === item.parent)) {
			parentPanels.push(item.parent);
		}
	});

	parentPanels.forEach(parent => {
		let parentTotalQuestions = 0;
		let parentTotalAnswered = 0;

		listOfPanelsWithParent.forEach(panel => {
			if (panel.parent === parent) {
				parentTotalQuestions = parentTotalQuestions + panel.totalAnswered;
				parentTotalAnswered = parentTotalAnswered + panel.totalQuestions;
			}
		});
		if (parentTotalQuestions !== 0) updatedCompletion[parent] = Math.round((parentTotalQuestions / parentTotalAnswered) * 100);
		else updatedCompletion[parent] = 0;
	});

	return {
		updatedCompletion,
	};
};

/**
 * [TotalQuestionAnswered]
 * @desc - Sets total questions answered for each section
 */
let totalQuestionsAnswered = (component, panelId = '', questionAnswers = {}, jsonSchema = {}) => {
	let totalQuestions = 0;
	let totalAnsweredQuestions = 0;

	if (_.isEmpty(panelId)) {
		const formPanels = [...component.state.jsonSchema.formPanels];
		let applicationQuestionAnswers = formPanels.reduce(
			(acc, val) => {
				let countObj = totalQuestionsAnswered(component, val.panelId);
				acc[0] = acc[0] + countObj.totalAnsweredQuestions;
				acc[1] = acc[1] + countObj.totalQuestions;
				return acc;
			},
			[0, 0]
		);

		return {
			totalAnsweredQuestions: applicationQuestionAnswers[0],
			totalQuestions: applicationQuestionAnswers[1],
		};
	} else {
		if (_.isEmpty(questionAnswers)) ({ questionAnswers } = { ...component.state });
		// 1. deconstruct schema
		if (_.isEmpty(jsonSchema)) {
			({ jsonSchema } = { ...component.state });
		}
		let { questionPanels = [], questionSets = [] } = jsonSchema;
		// 2. omits out blank null, undefined, and [] values from this.state.answers
		questionAnswers = _.pickBy({ ...questionAnswers }, v => v !== null && (v !== undefined) & (v !== '') && checkForArray(v));
		// 3. find the relevant questionSetIds within the panel
		const qPanel = questionPanels.find(qp => qp.panelId === panelId);
		if (!_.isNil(qPanel)) {
			const { questionSets: panelQuestionSets = [] } = qPanel;
			const qsIds = panelQuestionSets.map(qs => qs.questionSetId);
			// 4. find the relevant questionSets
			const qsets = questionSets.filter(qs => qsIds.includes(qs.questionSetId));
			// 5. ensure at least one was found
			if (!_.isEmpty(qsets)) {
				// 6. iterate through each question set to calculate answered and unanswered
				for (const questionSet of qsets) {
					// 7. get questions
					const { questions = [] } = questionSet;
					// 8. filter out buttons added as questions
					const filteredQuestions = filterInvalidQuestions(questions);
					// 9. Iterate through each top-level question
					for (const question of filteredQuestions) {
						// 10. Recursively gather question status from each question path
						const conditionalQuestions = getRecursiveQuestionCounts(question, questionAnswers);
						totalQuestions += conditionalQuestions.questionCount;
						totalAnsweredQuestions += conditionalQuestions.answerCount;
					}
				}
				// 11. Return question totals
				return { totalAnsweredQuestions, totalQuestions };
			}
		}
		return { totalAnsweredQuestions: 0, totalQuestions: 0 };
	}
};

let checkForArray = arr => {
	const type = Object.prototype.toString.call(arr);
	if (type === '[object Array]') {
		if (arr.length !== 0) {
			if (arr.map((item, i) => (item === '' ? i : -1)).filter(index => index !== -1).length < arr.length) {
				return true;
			}
			return false;
		} else return false;
	} else return true;
};

let filterInvalidQuestions = questions => {
	const filteredQuestions = [...questions].filter(q => {
		const { input = {} } = q;
		return !_.isEmpty(input) && input.type !== 'buttonInput';
	});
	return filteredQuestions;
};

let getRecursiveQuestionCounts = (question, questionAnswers) => {
	let questionCount = 0,
		answerCount = 0;
	// 1. Count parent question
	questionCount++;
	// 2. Count parent question if it has been answered
	if (_.has(questionAnswers, question.questionId)) {
		answerCount++;
		// 3. Check if the question has children/conditional questions
		if (_.has(question, 'input.options')) {
			// 4. Check if question allows multiple answers
			let conditionalQuestions = [];
			const answeredOptions = question.input.options.filter(opt => {
				return (
					(Array.isArray(questionAnswers[question.questionId]) && questionAnswers[question.questionId].includes(opt.value)) ||
					questionAnswers[question.questionId] === opt.value
				);
			});
			if (!_.isEmpty(answeredOptions)) {
				answeredOptions.forEach(answeredOption => {
					({ conditionalQuestions = [] } = answeredOption);
					// 4. Recursively iterate through conditional questions
					conditionalQuestions.forEach(function iter(currentQuestion) {
						// 5. Ensure valid question type (remove buttons)
						const { input = {} } = currentQuestion;
						if (!_.isEmpty(input) && input.type !== 'buttonInput') {
							// 6. Increment question count
							questionCount++;
							// 7. Increment answer count if answer found
							if (_.has(questionAnswers, currentQuestion.questionId)) {
								answerCount++;
								// 8. Call next level of recursion if answer has been provided
								if (_.has(currentQuestion, 'input.options')) {
									// 9. Find option based on answer provided
									let recursiveConditionalQuestions = [];
									const answeredRecursiveOptions = currentQuestion.input.options.filter(opt => {
										return (
											(Array.isArray(questionAnswers[currentQuestion.questionId]) &&
												questionAnswers[currentQuestion.questionId].includes(opt.value)) ||
											questionAnswers[currentQuestion.questionId] === opt.value
										);
									});
									if (!_.isEmpty(answeredRecursiveOptions)) {
										answeredRecursiveOptions.forEach(answeredRecursiveOption => {
											({ conditionalQuestions: recursiveConditionalQuestions = [] } = answeredRecursiveOption);
											// 10. Repeat function call
											if (!_.isEmpty(recursiveConditionalQuestions)) {
												Array.isArray(recursiveConditionalQuestions) && recursiveConditionalQuestions.forEach(iter);
											}
										});
									}
								}
							}
						}
					});
				});
			}
		}
	}
	return { questionCount, answerCount };
};

/**
 * [saveTime]
 * @desc Sets the lastSaved state on a field
 */
let saveTime = () => {
	let currentTime = moment().format('DD MMM YYYY HH:mm');
	let lastSaved = `Last saved ${currentTime}`;
	return lastSaved;
};

/**
 * [getSavedAgo]
 * @desc Returns the saved time for DAR
 */
let getSavedAgo = lastSaved => {
	if (!_.isEmpty(lastSaved)) return lastSaved;
	else return ``;
};

let getActiveQuestion = (questionsArr, questionId) => {
	let child;

	if (!questionsArr) return;

	for (const questionObj of questionsArr) {
		if (questionObj.questionId === questionId) return questionObj;

		if (typeof questionObj.input === 'object' && typeof questionObj.input.options !== 'undefined') {
			questionObj.input.options
				.filter(option => {
					return typeof option.conditionalQuestions !== 'undefined' && option.conditionalQuestions.length > 0;
				})
				.forEach(option => {
					if (!child) {
						child = getActiveQuestion(option.conditionalQuestions, questionId);
					}
				});
		}

		if (child) return child;
	}
};

let calcAccordionClasses = (active, allowedNavigation) => {
	let classes = ['black-16'];
	if (!allowedNavigation) classes = [...classes, 'disabled'];

	if (active) classes = [...classes, 'active'];

	return classes;
};

let createTopicContext = (datasets = []) => {
	if (_.isEmpty(datasets)) {
		return {
			datasets: [],
			tags: [],
			relatedObjectIds: [],
			subTitle: '',
			allowNewMessage: false,
		};
	}
	let dataRequestModalContent = {},
		allowsMessaging = false,
		requiresModal = false,
		allowNewMessage = false;
	let { publisherObj = {}, contactPoint = '', publisher = '' } = datasets[0];
	if (!_.isEmpty(publisherObj)) {
		dataRequestModalContent = publisherObj.dataRequestModalContent;
		allowsMessaging = publisherObj.allowsMessaging;
		requiresModal = !_.isEmpty(publisherObj.dataRequestModalContent) ? true : false;
		allowNewMessage = publisherObj.allowsMessaging;
	}
	return {
		requiresModal,
		allowNewMessage,
		allowsMessaging,
		dataRequestModalContent,
		datasets:
			datasets.map(dataset => {
				let { datasetId } = dataset;
				return { datasetId, publisher };
			}) || [],
		tags: datasets.map(dataset => dataset.name) || [],
		relatedObjectIds: datasets.map(dataset => dataset._id),
		title: publisher || '',
		subTitle: datasets.map(dataset => dataset.name).join(' '),
		contactPoint,
	};
};

let createModalContext = (datasets = []) => {
	let dataRequestModalContent = {},
		allowsMessaging = false,
		requiresModal = false,
		allowNewMessage = false;
	let { publisherObj = {}, contactPoint = '', publisher = '' } = datasets[0];
	if (!_.isEmpty(publisherObj)) {
		dataRequestModalContent = publisherObj.dataRequestModalContent;
		allowsMessaging = publisherObj.allowsMessaging;
		requiresModal = !_.isEmpty(publisherObj.dataRequestModalContent) ? true : false;
		allowNewMessage = publisherObj.allowsMessaging;
	}
	return {
		requiresModal,
		allowNewMessage,
		allowsMessaging,
		dataRequestModalContent,
		datasets,
		contactPoint,
		title: publisher,
	};
};

/**
 * [removeStaticPages]
 * @desc 		Removes the static pageId to stop Nav from duplicating
 * @param   {[object]}  schema  [schema]
 * @return  {[object]}          [return schema]
 */
let removeStaticPages = (schema = {}) => {
	let { pages, formPanels } = { ...schema };
	// filter pageId within pages
	let originalPages = _.uniqBy(pages, 'pageId');
	// unique panelId within form panels
	let originalFormPanels = _.uniqBy(formPanels, 'panelId');
	// return updated schema
	return {
		...schema,
		pages: originalPages,
		formPanels: originalFormPanels,
	};
};

const _buildCompletionWheels = completionObj => {
	Object.keys(completionObj).forEach((section, completion) => {
		console.log(section);
		console.log(completion);
	});
};

const _calculateTimeDifference = startTime => {
	let start = moment(startTime);
	let end = moment();
	return end.diff(start, 'days');
};

const getUpdatesSubmittedLog = updates => {
	const key = Object.keys(updates)[0];

	return {
		heading: _.startCase(key.replace(/[^\/]*$/g, '')).replace(/\s/g, ' | '),
		question: _.startCase(key.replace(/^.*\//, '')),
		answers: { ...updates[key] },
	};
};

const getLocationsObj = values => {
	return values.map(item => {
		return { location: item.split(',').pop(), hierarchy: item };
	});
};

export default {
	questionSetToDuplicate: questionSetToDuplicate,
	insertSchemaUpdates: insertSchemaUpdates,
	removeQuestionReferences: removeQuestionReferences,
	findQuestionSet: findQuestionSet,
	findQuestion: findQuestion,
	removeQuestionAnswers: removeQuestionAnswers,
	autoComplete: autoComplete,
	totalQuestionsAnswered: totalQuestionsAnswered,
	getCompletionPercentages: getCompletionPercentages,
	saveTime: saveTime,
	getSavedAgo: getSavedAgo,
	getActiveQuestion: getActiveQuestion,
	calcAccordionClasses: calcAccordionClasses,
	createTopicContext: createTopicContext,
	createModalContext: createModalContext,
	configActionModal: configActionModal,
	generateStatusCounts: generateStatusCounts,
	staticContent: staticContent,
	datasetStatus: datasetStatus,
	datasetStatusColours: datasetStatusColours,
	datasetSLAText: datasetSLAText,
	darCommentTitle: darCommentTitle,
	darStaticPageIds: darStaticPageIds,
	actionKeys: actionKeys,
	amendmentModes: amendmentModes,
	flagIcons: flagIcons,
	flagPanelIcons: flagPanelIcons,
	userTypes: userTypes,
	amendmentStatuses: amendmentStatuses,
	removeStaticPages: removeStaticPages,
	calculateTimeDifference: _calculateTimeDifference,
	buildCompletionWheels: _buildCompletionWheels,
	getUpdatesSubmittedLog: getUpdatesSubmittedLog,
	getLocationsObj: getLocationsObj,
};
