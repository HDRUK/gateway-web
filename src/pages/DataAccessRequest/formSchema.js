export const formSchema = {
    "classes": {
        "form": "login-form",
        "select": "form-control",
        "typeaheadCustom": "form-control",
        "datePickerCustom": "form-control",
        "question": "form-group",
        "input": "form-control",
        "radioListItem": "radio",
        "radioList": "clean-list list-inline",
        "checkboxInput": "checkbox",
        "checkboxListItem": "checkbox",
        "checkboxList": "clean-list",
        "controlButton": "btn btn-primary pull-right",
        "backButton": "btn btn-default pull-left",
        "errorMessage": "alert alert-danger",
        "buttonBar": "button-bar" 
    },
    "pages": [
        {
            "pageId": "preSubmission",
            "title": "Pre-submission",
            "description": "Make sure you have everything you need before you start the application process",
            "active": true
        },
        {
            "pageId": "safePeople",
            "title": "Safe People",
            "description": "Please identify any persons or organisations who will have access to the data",
            "active": false
        },
        {
            "pageId": "safeProject",
            "title": "Safe Project",
            "description": "Something else...",
            "active": false
        },
        {
            "pageId": "safeData",
            "title": "Safe Data",
            "description": "Something else...",
            "active": false
        },
        {
            "pageId": "safeSettings",
            "title": "Safe Settings",
            "description": "Something else...",
            "active": false
        },
        {
            "pageId": "safeOutputs",
            "title": "Safe outputs",
            "description": "Something else...",
            "active": false
        },
        {
            "pageId": "postSubmission",
            "title": "Post-submission",
            "description": "Something else...",
            "active": false
        },
    ],
    "formPanels": [
        {
            "index": 1,
            "panelId": "mrcHealthDataToolkit",
            "pageId": "preSubmission"
        },
        {
            "index": 2,
            "panelId": "adviceFromPublisher",
            "pageId": "preSubmission"
        },
        {
            "index": 3,
            "panelId": "applicant",
            "pageId": "safePeople"
        },
        {
            "index": 4,
            "panelId": "principleInvestigator",
            "pageId": "safePeople"
        },
        {
            "index": 5,
            "panelId": "safeProject",
            "pageId": "safeProject"
        }
    ],
    "questionPanels": [
        {
            "panelId": "mrcHealthDataToolkit",
            "panelHeader": "MRC Health Data Access toolkit",
            "navHeader": "MRC Health Data Toolkit",
            "questionPanelHeaderText": "Test",
            "pageId": "preSubmission"
        },
        {
            "panelId": "adviceFromPublisher",
            "panelHeader": "Advice from Publisher",
            "navHeader": "Advice from Publisher",
            "questionPanelHeaderText": "Test",
            "pageId": "preSubmission",
        },
        {
            "panelId": "applicant",
            "panelHeader": "Applicant Details",
            "navHeader": "Applicant",
            "questionPanelHeaderText": "Test",
            "pageId": "safePeople",
            "action": {
                "default": {
                  "action": "GOTO",
                  "target": "principleInvestigatorl"
                }
              },
              "button": {
                "text": "Next",
                "disabled": false
              },
            "questionSets": [
                {
                    "index": 1,
                    "questionSetId": "applicant"
                }
            ]
        },
        {
            "panelId": "principleInvestigator",
            "panelHeader": "Principle Investigator",
            "navHeader": "Principle Investigator",
            "pageId": "safePeople",
            "questionSets": [
                {
                    "index": 2,
                    "questionSetId": "principleInvestigator"
                }
            ]
        },
        {
            "panelId": "safeProject",
            "panelHeader": "Safe Project",
            "navHeader": "Safe Project",
            "pageId": "safeProject",
            action: {
                "default": {
                    "action": "SUBMIT",
                    "target": ""
                }
            },
            "button": {
                "text": "Submit"
            },
            "questionSets": [
                {
                    "index": 1,
                    "questionSetId": "safeProject"
                }
            ]
        },
    ],
    "questionSets": [
        {
            "questionSetId": "applicant",
            "questionSetHeader": "Applicant details tests",
            "questions": [
                {
                    "questionId": "applicantName",
                    "question": "Applicant name",
                    "input": {
                        "type": "textInput"
                    },
                    "validations" : [{
                        "type" : "isLength",
                        "params" : [1,90]
                    }]
                },
                {
                    "questionId": "passportNumber",
                    "question": "Passport number",
                    "input": {
                        "type": "textInput"
                    },
                    "validations": [{
                        "type": "isLength",
                        "params": [
                            18
                        ]}
                    ]
                },
                {
                    "questionId": "principleInvestigator",
                    "question": "Are you the principe investigator?",
                    "input": {
                        "type": "radioOptionsInput",
                        "options": [
                            {
                                "text": "Yes",
                                "value": "true"
                            },
                            {
                                "text": "No",
                                "value": "false",
                                "conditionalQuestions": [
                                    {
                                        "questionId": "principleInvestigatorReason",
                                        "question": "Reason for requesting data?",
                                        "input": {
                                            "type": "textareaInput"
                                        },
                                        "validations": [
                                            {
                                                "type": "isLength",
                                                "params": [
                                                    18
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }, 
        {
            "questionSetId": "principleInvestigator",
            "questionSetHeader": "Principle Investigator details",
            "questions": [
                {
                    "questionId": "regICONumber",
                    "question": "ICO number",
                    "input": {
                        "type": "textInput"
                    },
                    "validations": [{
                        "type": "isLength",
                        "params": [
                            1,
                            8
                        ]}
                    ]
                },
            ]
        },
        {
            "questionSetId": "safeProject",
            "questionSetHeader": "SafeProject",
            "questions": [{
                "questionId": "firstName",
                "question": "First name",
                "input": {
                    "type": "textInput"
                }
            }]
        }
    ]
}