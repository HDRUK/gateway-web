import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { isArray } from 'lodash';
import moment from 'moment';
import googleAnalytics from '../../../tracking';
import SVGIcon from '../../../images/SVGIcon';
import Tag from '../../commonComponents/relatedObject/Tag/Tag';
import AboutSection from './AboutSection';

const About = ({ data }) => {
    const [closedLaySummary, setClosedLaySummary] = useState(true);
    const [closedPublicBenefit, setClosedPublicBenefit] = useState(true);
    const [closedDataUse, setClosedDataUse] = useState(true);
    const [hide, setHide] = useState(true);
    const notSpecified = <p className='gray800-14-opacity'>Not specified</p>;

    let count =
        Object.keys(data).length === 0
            ? data &&
              data.reduce(function recur(sum, obj) {
                  return sum + (obj === '' || (Object(obj) === obj && Object.values(obj).reduce(recur, 0)));
              }, 0)
            : 0;

    const handleAnalytics = (label, value) => {
        googleAnalytics.recordEvent('Data uses', label, value);
    };

    return (
        <>
            <>
                <Container className='datause-card datause-safeInfo'>
                    <p className='black-14-bold'>Safe people</p>
                    <AboutSection
                        heading='Organisation name'
                        id='organisation-name-details'
                        toolTipText='The name of the legal entity that signs the contract to access the data.'
                    >
                        <span data-testid='organisation-name-details'>
                            {data.organisationName.length > 0 ? (
                                <>
                                    {data.organisationName.split(',').map((value, i) => (
                                        <Tag
                                            key={`organisationName-${i}`}
                                            tagName={value.trim()}
                                            url='/search?search=&tab=Datauses&datauseorganisationname='
                                            onSearchPage={false}
                                            activeLink
                                            tagType='tag'
                                            className='badge-datause-bold'
                                            onClick={() => handleAnalytics('Clicked datauseorganisationname', value.trim())}
                                        />
                                    ))}
                                </>
                            ) : (
                                notSpecified
                            )}
                        </span>
                    </AboutSection>
                    {!data.organisationId && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Organisation ID'
                            id='organisationId-details'
                            toolTipText='A unique identifier for an organisation that is preferably an industry used standard such as Grid.ac (see https://www.grid.ac/institutes).'
                        >
                            <span data-testid='organisationId-details'>
                                {data.organisationId && data.organisationId.length > 0 ? data.organisationId : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.organisationSector && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Organisation sector'
                            id='datauserganisationsector-details'
                            toolTipText='Sector which the applicant(s) work falls under.'
                        >
                            <span data-testid='datauserganisationsector-details'>
                                {data.organisationSector && data.organisationSector.length > 0 ? (
                                    <Tag
                                        tagName={data.organisationSector}
                                        tagType='tag'
                                        url='/search?search=&tab=Datauses&datauserganisationsector='
                                        onSearchPage={false}
                                        activeLink
                                        onClick={() => handleAnalytics('Clicked datauserganisationsector', data.organisationSector)}
                                    />
                                ) : (
                                    notSpecified
                                )}
                            </span>
                        </AboutSection>
                    )}
                    {(!data.gatewayApplicants || data.gatewayApplicants.length === 0) &&
                    (!data.nonGatewayApplicants || data.nonGatewayApplicants.length === 0) &&
                    hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Applicant name(s)'
                            id='applicant-details'
                            toolTipText='The name of the Principal Investigator, as well as any other individuals that have been authorised to use the data.'
                        >
                            <span data-testid='applicant-details'>
                                {(data.gatewayApplicants && data.gatewayApplicants.length > 0) ||
                                (data.nonGatewayApplicants && data.nonGatewayApplicants.length > 0) ? (
                                    <>
                                        {data &&
                                            data.gatewayApplicants.map((gatewayApplicant, i) => (
                                                <Tag
                                                    key={`gatewayApplicant-${i}`}
                                                    tagId={gatewayApplicant.id}
                                                    tagName={`${gatewayApplicant.firstname} ${gatewayApplicant.lastname}`}
                                                    tagType='tag'
                                                    url='/person/'
                                                    onSearchPage={false}
                                                    showTagType={false}
                                                    activeLink
                                                    className='hdruser badge-datause-bold'
                                                >
                                                    <span className='datatuse-personicon-bg'>
                                                        <SVGIcon name='personiconwithbg' width={17} height={16} fill='#3db28c' />
                                                    </span>
                                                </Tag>
                                            ))}
                                        {data &&
                                            data.nonGatewayApplicants.map(nonGatewayApplicant => (
                                                <span className='nonhdruser badge-datause-bold badge-tag'>{nonGatewayApplicant}</span>
                                            ))}
                                    </>
                                ) : (
                                    notSpecified
                                )}
                            </span>
                        </AboutSection>
                    )}
                    {!data.applicantId && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Applicant ID'
                            id='applicantId-details'
                            toolTipText='A unique identifier for the applicant that is preferably an industry used standard such as Grid.ac (see https://www.grid.ac/)'
                        >
                            <span data-testid='applicantId-details'>
                                {data.applicantId && data.applicantId.length > 0 ? data.applicantId : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {data.fundersAndSponsors && data.fundersAndSponsors.length === 0 && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Funders/Sponsor'
                            id='funders-sponsor-details'
                            toolTipText='The name of any funders or sponsors involved in the project'
                        >
                            <span data-testid='funders-sponsor-details'>
                                {data.fundersAndSponsors.length > 0
                                    ? data.fundersAndSponsors.map((value, i) => (
                                          <Tag
                                              key={`fundersandsponsors-${i}`}
                                              tagName={value}
                                              tagType='tag'
                                              url='/search?search=&tab=Datauses&datausefundersandsponsors='
                                              onSearchPage={false}
                                              activeLink
                                              onClick={() => handleAnalytics('Clicked datausefundersandsponsors', value)}
                                          />
                                      ))
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.accreditedResearcherStatus && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='DEA accredited researcher status'
                            id='researcher-details'
                            toolTipText='The accreditation status of the Principal Investigator/applicant, as defined by the ONS Research Code of Practice and Accreditation criteria.'
                        >
                            <span data-testid='researcher-details'>
                                {data.accreditedResearcherStatus && data.accreditedResearcherStatus.length > 0
                                    ? data.accreditedResearcherStatus
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.sublicenceArrangements && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Sub-licence arrangements (if any)?'
                            id='sub-licence-details'
                            toolTipText='Identifies whether there are any permissions for the applicant to share the data beyond the named parties.'
                        >
                            <span data-testid='sub-licence-details'>
                                {data.sublicenceArrangements && data.sublicenceArrangements.length > 0
                                    ? data.sublicenceArrangements
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                </Container>
                <Container className='datause-card datause-safeInfo'>
                    <p className='black-14-bold'>Safe projects</p>
                    {!data.projectIdText && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Project ID'
                            id='projectId-details'
                            toolTipText='A unique identifier for the project that is preferably an industry used standard, such as IRAS ID. However for non-research projects, a unique reference number created by the data custodian on receipt of the application is sufficient.'
                        >
                            <span data-testid='projectId-details'>
                                {data.projectIdText && data.projectIdText.length > 0 ? data.projectIdText : notSpecified}
                            </span>
                        </AboutSection>
                    )}

                    <AboutSection
                        heading='Project title'
                        id='project-title-details'
                        toolTipText='The title of the project/research study/request that the applicant is investigating through the use of health data.'
                    >
                        <span data-testid='project-title-details'>
                            {data.projectTitle && data.projectTitle.length > 0 ? data.projectTitle : notSpecified}
                        </span>
                    </AboutSection>
                    <AboutSection
                        heading='Lay summary'
                        id='laySummary-details'
                        showMoreButton={!!(data.laySummary && data.laySummary.length >= 250)}
                        showLess={closedLaySummary}
                        onClickHandler={() => (!closedLaySummary ? setClosedLaySummary(true) : setClosedLaySummary(false))}
                        toolTipText='A concise and clear description of the project, (e.g. as required by URKI in funding applications). It should outline the problem, objectives and expected outcomes in language that is understandable to the general public and contain a maximum of 300 words.'
                    >
                        <span data-testid='laySummary-details'>
                            {data.laySummary && data.laySummary.length > 0 ? (
                                closedLaySummary ? (
                                    <>
                                        {data.laySummary.substr(0, 250)}
                                        {data.laySummary.length >= 250 ? '...' : ''}
                                    </>
                                ) : (
                                    data.laySummary
                                )
                            ) : (
                                notSpecified
                            )}
                        </span>
                    </AboutSection>
                    <AboutSection
                        heading='Public benefit statement'
                        id='publicBenefitStatement-details'
                        showMoreButton={!!(data.publicBenefitStatement && data.publicBenefitStatement.length >= 250)}
                        showLess={closedPublicBenefit}
                        onClickHandler={() => (!closedPublicBenefit ? setClosedPublicBenefit(true) : setClosedPublicBenefit(false))}
                        toolTipText='A description in plain English of the anticipated outcomes, or impact of project on the general public.'
                    >
                        <span data-testid='publicBenefitStatement-details'>
                            {data.publicBenefitStatement && data.publicBenefitStatement.length > 0 ? (
                                closedPublicBenefit ? (
                                    <>
                                        {data.publicBenefitStatement.substr(0, 250)}
                                        {data.publicBenefitStatement.length >= 250 ? '...' : ''}
                                    </>
                                ) : (
                                    data.publicBenefitStatement
                                )
                            ) : (
                                notSpecified
                            )}
                        </span>
                    </AboutSection>

                    {!data.requestCategoryType && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Request category type'
                            id='request-type-details'
                            toolTipText='This categorises the main purpose of the data being shared.'
                        >
                            <span data-testid='request-type-details'>
                                {data.requestCategoryType && data.requestCategoryType.length > 0 ? data.requestCategoryType : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.technicalSummary && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Technical summary'
                            id='technical-summary-details'
                            toolTipText='A summary of the proposed research, in a manner that is suitable for a specialist reader.'
                        >
                            <span data-testid='technical-summary-details'>
                                {data.technicalSummary && data.technicalSummary.length > 0 ? data.technicalSummary : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {(!data.otherApprovalCommittees || data.otherApprovalCommittees.length === 0) && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Other approval committees'
                            id='otherApprovalCommittees-details'
                            toolTipText='Reference to other decision-making bodies that the project has already been authorised by.'
                        >
                            <span data-testid='otherApprovalCommittees-details'>
                                {data.otherApprovalCommittees && data.otherApprovalCommittees.length > 0
                                    ? data.otherApprovalCommittees
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.projectStartDate && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Project start date'
                            id='project-start-date-details'
                            toolTipText='The date the project is scheduled to start or actual start date.'
                        >
                            <span data-testid='project-start-date-details'>
                                {data.projectStartDate && data.projectStartDate.length > 0
                                    ? moment(data.projectStartDate).format('YYYY-MM-DD')
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.projectEndDate && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Project End date'
                            id='project-end-date-details'
                            toolTipText='The date the project is scheduled to finish or actual end date.'
                        >
                            <span data-testid='project-end-details'>
                                {data.projectEndDate && data.projectEndDate.length > 0
                                    ? moment(data.projectEndDate).format('YYYY-MM-DD')
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    <AboutSection
                        heading='Latest approval date'
                        id='latest-approval-details'
                        toolTipText='The last date the data access request for this project was approved by a data custodian.'
                    >
                        <span data-testid='latest-approval-details'>
                            {data.latestApprovalDate && data.latestApprovalDate.length > 0
                                ? moment(data.latestApprovalDate).format('YYYY-MM-DD')
                                : notSpecified}
                        </span>
                    </AboutSection>
                </Container>
                <Container className='datause-card datause-view-grid datause-safeInfo'>
                    <p className='black-14-bold'>Safe data</p>
                    <AboutSection heading='Dataset(s) name' id='dataset-details' toolTipText='The name of the dataset(s) being accessed.'>
                        <span data-testid='dataset-details'>
                            {(data.gatewayDatasetsInfo && data.gatewayDatasetsInfo.length > 0) ||
                            (data.nonGatewayDatasets && data.nonGatewayDatasets.length > 0) ? (
                                <>
                                    {data &&
                                        data.gatewayDatasetsInfo.map((gatewayDataset, i) => (
                                            <>
                                                {isArray(gatewayDataset) ? (
                                                    <Tag
                                                        key={`gatewayDataset-0-${i}`}
                                                        tagName={gatewayDataset[0].name}
                                                        tagId={gatewayDataset[0].pid}
                                                        tagType='tag'
                                                        url='/dataset/'
                                                        onSearchPage={false}
                                                        activeLink
                                                        className='badge-datause-bold'
                                                        onClick={() => handleAnalytics('Clicked dataset', gatewayDataset[0].pid)}
                                                    />
                                                ) : (
                                                    <Tag
                                                        key={`gatewayDataset-${i}`}
                                                        tagName={gatewayDataset.name}
                                                        tagId={gatewayDataset.pid}
                                                        tagType='tag'
                                                        url='/dataset/'
                                                        onSearchPage={false}
                                                        activeLink
                                                        className='badge-datause-bold'
                                                        onClick={() => handleAnalytics('Clicked dataset', gatewayDataset.pid)}
                                                    />
                                                )}
                                            </>
                                        ))}

                                    {data &&
                                        data.nonGatewayDatasets.map((nonGatewayDataset, i) => (
                                            <>
                                                {' '}
                                                <span className='nonhdrdataset badge-datause-bold badge-tag' key={`nonhdrdataset-${i}`}>
                                                    {nonGatewayDataset}
                                                </span>
                                            </>
                                        ))}
                                </>
                            ) : (
                                notSpecified
                            )}
                        </span>
                    </AboutSection>

                    {!data.dataSensitivityLevel && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Data sensitivity level'
                            id='data-sensitivity-details'
                            toolTipText='The level of identifiability of the data being accessed, as defined by Understanding Patient Data. In the case of multiple datasets being accessed, the sensitivity level for the dataset with the most sensitive data should be used: Personally Identifiable > De-Personalised > Anonymous'
                        >
                            <span data-testid='data-sensitivity-details'>
                                {data.dataSensitivityLevel && data.dataSensitivityLevel.length > 0
                                    ? data.dataSensitivityLevel
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.legalBasisForDataArticle6 && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Legal basis for provision of data under Article 6'
                            id='legal-basis-6-details'
                            toolTipText='The lawful basis for processing are set out in Article 6 of the GDPR. At least one legal basis must apply whenever you process personal data. Please select appropriate Article 6 lawful basis. Processing shall be lawful only if and to the extent that at least one of the following applies.'
                        >
                            <span data-testid=''>
                                {data.legalBasisForDataArticle6 && data.legalBasisForDataArticle6.length > 0
                                    ? data.legalBasisForDataArticle6
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.legalBasisForDataArticle9 && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Lawful conditions for provision of data under Article 9'
                            id='legal-basis-9-details'
                            toolTipText="Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited. This does not apply if one of the following applies."
                        >
                            <span data-testid='legal-basis-9-details'>
                                {data.legalBasisForDataArticle9 && data.legalBasisForDataArticle9.length > 0
                                    ? data.legalBasisForDataArticle9
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.dutyOfConfidentiality && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Common law of duty of confidentiality'
                            id='duty-details'
                            toolTipText='In the application of the Common Law Duty of Confidentiality there are 2 options that enable a release: Consent (Reasonable Expectation) or Section 251 NHS Act 2006.'
                        >
                            <span data-testid='duty-details'>
                                {data.dutyOfConfidentiality && data.dutyOfConfidentiality.length > 0
                                    ? data.dutyOfConfidentiality
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.nationalDataOptOut && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='National data opt-out applied?'
                            id='data-opt-out-details'
                            toolTipText='Specifies whether the preference for people to opt-out of their confidential patient information being used for secondary use has been applied to the data prior to release.'
                        >
                            <span data-testid='data-opt-out-details'>
                                {data.nationalDataOptOut && data.nationalDataOptOut.length > 0 ? data.nationalDataOptOut : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.requestFrequency && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Request frequency'
                            id='request-requency-details'
                            toolTipText='Determines whether this a "one-off" request or a recurring dataset to be provided over a specific time period.'
                        >
                            <span data-testid='request-requency-details'>
                                {data.requestFrequency && data.requestFrequency.length > 0 ? data.requestFrequency : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.datasetLinkageDescription && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='For linked datasets, specify how the linkage will take place'
                            id='linkage-details'
                            toolTipText='The information relevant to data linkage, including organisations undertaking linkages and data flows.'
                        >
                            <span data-testid='linkage-details'>
                                {data.datasetLinkageDescription && data.datasetLinkageDescription.length > 0
                                    ? data.datasetLinkageDescription
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                    {!data.confidentialDataDescription && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Description of the confidential data being used'
                            id='confidential-data-details'
                            showMoreButton={!!(data.confidentialDataDescription && data.confidentialDataDescription.length >= 250)}
                            showLess={closedDataUse}
                            onClickHandler={() => (!closedDataUse ? setClosedDataUse(true) : setClosedDataUse(false))}
                            toolTipText='A description of the specific patient identifiable fields that have been included in the dataset(s) being accessed.'
                        >
                            <span data-testid='confidential-data-details'>
                                {closedDataUse
                                    ? data.confidentialDataDescription
                                        ? data.confidentialDataDescription.substr(0, 150)
                                        : notSpecified
                                    : data.confidentialDataDescription}
                            </span>
                        </AboutSection>
                    )}
                    {!data.accessDate && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='Release/Access date'
                            id='access-date-details'
                            toolTipText='The date the data access was granted and active research started.'
                        >
                            <span data-testid='access-date-details'>
                                {data.accessDate && data.accessDate.length > 0
                                    ? moment(data.accessDate).format('YYYY-MM-DD')
                                    : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                </Container>
                <Container className='datause-card datause-safeInfo'>
                    <p className='black-14-bold'>Safe setting</p>
                    <AboutSection
                        heading='Access type'
                        id='access-type-details'
                        toolTipText='An indication of how data is accessed, whether through access to a Data Safe Haven/Trusted Research Environment or through data release in any other local environment.'
                    >
                        <span data-testid='access-type-details'>
                            {data.accessType && data.accessType.length > 0 ? data.accessType : notSpecified}
                        </span>
                    </AboutSection>

                    {!data.privacyEnhancements && hide ? (
                        (() => {
                            count++;
                        })()
                    ) : (
                        <AboutSection
                            heading='How has data been processed to enhance privacy?'
                            id='privacy-details'
                            toolTipText='Description of the tools or software used to reduce level of identifiable data being shared.'
                        >
                            <span data-testid='privacy-details'>
                                {data.privacyEnhancements && data.privacyEnhancements.length > 0 ? data.privacyEnhancements : notSpecified}
                            </span>
                        </AboutSection>
                    )}
                </Container>

                {(!data.gatewayOutputsToolsInfo || data.gatewayOutputsToolsInfo.length === 0) &&
                (!data.gatewayOutputsPapers || data.gatewayOutputsPapers.length === 0) &&
                (!data.nonGatewayOutputs || data.nonGatewayOutputs.length === 0) &&
                hide ? (
                    (() => {
                        count++;
                    })()
                ) : (
                    <Container className='datause-card datause-safeInfo'>
                        <p className='black-14-bold'>Safe output</p>
                        <AboutSection
                            heading='Link to research outputs'
                            id='output-details'
                            toolTipText='A URL link to any academic or non-academic research outputs, as they become available, including code used.'
                        >
                            <span data-testid='output-details'>
                                {(data.gatewayOutputsToolsInfo && data.gatewayOutputsToolsInfo.length > 0) ||
                                (data.gatewayOutputsPapers && data.gatewayOutputsPapers.length > 0) ||
                                (data.nonGatewayOutputs && data.nonGatewayOutputs.length > 0) ? (
                                    <>
                                        {data &&
                                            data.gatewayOutputsToolsInfo.map((gatewayOutputsTool, i) => (
                                                <Tag
                                                    key={`gatewayOutputsTool-${i}`}
                                                    tagId={gatewayOutputsTool.id}
                                                    tagName={gatewayOutputsTool.name}
                                                    tagType='tag'
                                                    url='/tool/'
                                                    onSearchPage={false}
                                                    showTagType={false}
                                                    activeLink
                                                    className='badge-datause-bold'
                                                    onClick={() => handleAnalytics('Clicked tool', gatewayOutputsTool.id)}
                                                />
                                            ))}{' '}
                                        {data &&
                                            data.gatewayOutputsPapersInfo.map((gatewayOutputsPaper, i) => (
                                                <Tag
                                                    key={`gatewayOutputsPaper-${i}`}
                                                    tagId={gatewayOutputsPaper.id}
                                                    tagName={gatewayOutputsPaper.name}
                                                    tagType='tag'
                                                    url='/paper/'
                                                    onSearchPage={false}
                                                    showTagType={false}
                                                    activeLink
                                                    className='badge-datause-bold'
                                                    onClick={() => handleAnalytics('Clicked paper', gatewayOutputsPaper.id)}
                                                />
                                            ))}{' '}
                                        {data &&
                                            data.nonGatewayOutputs.map(nonGatewayOutput => (
                                                <div>
                                                    <a href={nonGatewayOutput} className='purple-blue-14'>
                                                        {nonGatewayOutput}
                                                    </a>
                                                </div>
                                            ))}
                                    </>
                                ) : (
                                    notSpecified
                                )}
                            </span>
                        </AboutSection>
                    </Container>
                )}
            </>
            <Row>
                <Col className='datause-about-info'>
                    <p className='soft-black-14'>
                        Data custodians are responsible for providing information about their approved data uses register. Where not all
                        fields are completed, we hide empty fields to make the page easier to read, but you can choose to view them.
                    </p>
                </Col>
            </Row>
            <Row className='datause-hidefields-button'>
                <Button
                    className='datause-button'
                    onClick={() => {
                        hide ? setHide(false) : setHide(true);

                        handleAnalytics('Clicked show / hide empty fields', !hide ? 'show' : 'hide');
                    }}
                    data-testid='hidefields'
                >
                    {!hide ? 'Hide all empty fields' : `Show all empty fields (${count})`}
                </Button>
            </Row>
        </>
    );
};

export default About;
