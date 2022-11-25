import React from 'react';
import './AdvancedSearchRequestAccessModal.scss';
import { Form } from 'react-bootstrap';

const AdvancedSearchTAndCsContent = props => {
    const { formik } = props;

    return (
        <div className='advancedSearchTAndCModal'>
            <div className={props.showFormValidation ? 'relatedModalBackground' : ''}>
                <p>Click on the links below to go straight to more information on each area:</p>
                <div className='termsLinks'>
                    <a className='termsLink' href='#terms-2'>
                        Who we are and how to contact us
                    </a>
                    <a className='termsLink' href='#terms-3'>
                        Acceptance of Terms and Conditions
                    </a>
                    <a className='termsLink' href='#terms-4'>
                        Other Terms and Conditions that apply to you  
                    </a>
                    <a className='termsLink' href='#terms-5'>
                        Changes to Terms and Conditions
                    </a>
                    <a className='termsLink' href='#terms-6'>
                        Your account and password 
                    </a>
                    <a className='termsLink' href='#terms-7'>
                        Disclaimer
                    </a>
                    <a className='termsLink' href='#terms-8'>
                        Requesting data sets via the site
                    </a>
                    <a className='termsLink' href='#terms-9'>
                        External links
                    </a>
                    <a className='termsLink' href='#terms-10'>
                        Copyright (and other intellectual property rights) restrictions
                    </a>
                    <a className='termsLink' href='#terms-11'>
                        Restrictions on your use of the site
                    </a>
                    <a className='termsLink' href='#terms-12'>
                        Accuracy of information
                    </a>
                    <a className='termsLink' href='#terms-13'>
                        Suspension and termination
                    </a>
                    <a className='termsLink' href='#terms-14'>
                        Other important terms
                    </a>
                </div>
                <p id='terms-2' className='termsSubtitle'>
                    Who we are and how to contact us
                </p>
                <p>
                    This Gateway Portal (the <b>“site“</b>) is operated by Health Data Research UK (“HDR UK”). HDR UK is a limited company
                    registered in England and Wales under company number 10887014 and its registered office is at 215 Euston Road, London,
                    England, NW1 2BE.
                </p>
                <p>To contact us, please use the contact details on our page.</p>
                <p id='terms-3' className='termsSubtitle'>
                    Acceptance of Terms and Conditions
                </p>
                <p>
                    Access to and use of this site is provided by HDR UK subject to the following:
                    <ul className='termsBulletList'>
                        <li>
                            By using this site you confirm that you accept these terms and conditions (including any Additional Terms that
                            may apply as below) (together, the <b>"Terms and Conditions"</b>) and that you agree to comply with them. The
                            Terms and Conditions take effect on the date of your first use of the site.
                        </li>
                        <li>If you do not agree to the Terms and Conditions, you must not use our site.</li>
                    </ul>
                </p>
                <p id='terms-4' className='termsSubtitle'>
                    Other Terms and Conditions that apply to you
                </p>
                <p>
                    Additional terms and conditions may apply when you use certain functions made available on the site, including the terms
                    of use for the Discovery Tool (the "<b>Additional Terms</b>").The following additional documents also apply to your use
                    of our site as an individual user:
                    <ul className='termsBulletList'>
                        <li>
                            <a className='link' href='https://www.hdruk.ac.uk/privacy-policy/' target='_blank' rel='noopener noreferrer'>
                                Privacy Policy
                            </a>
                            , which sets out how we will use your personal data.
                        </li>
                        <li>
                            <a
                                className='link'
                                href='https://www.hdruk.ac.uk/terms-and-conditions/cookies/'
                                target='_blank'
                                rel='noopener noreferrer'>
                                Cookie Policy
                            </a>
                            , which sets out information about the cookies on our site.
                        </li>
                    </ul>
                </p>
                <p id='terms-5' className='termsSubtitle'>
                    Changes to Terms and Conditions
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            HDR UK reserves the right to amend the Terms and Conditions from time to time. When you use this site, please
                            check the Terms and Conditions. These terms were most recently updated on 28th February 2021.
                        </li>
                        <li>
                            By continuing to use the site after amendments are made you confirm that you accept the amendments and that you
                            agree to comply with them.
                        </li>
                    </ul>
                </p>
                <p id='terms-6' className='termsSubtitle'>
                    Your account and password
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            You will need to register an account with us on the site in order to access certain services available on the
                            site, including the Discovery Tool ("<b>Account</b>"). In order to register for an Account, you must be aged 18
                            or over. If you register an Account, you will be asked to provide certain information (such as your Athens
                            account details or email address) and to create a password, as part of our security procedures. You must treat
                            the password as confidential and you must not disclose it to any third party.
                        </li>
                        <li>
                            We have the right to disable any Accounts and/or passwords, at any time, if in our reasonable opinion you have
                            failed to comply with any of the provisions of the Terms and Conditions.
                        </li>
                        <li>
                            If you know or suspect that anyone other than you knows your Account login details, you must immediately notify
                            us at support@healthdatagateway.org.
                        </li>
                        <li>You are responsible for any unauthorised use of your Account login details.</li>
                    </ul>
                </p>
                <p id='terms-7' className='termsSubtitle'>
                    Disclaimer
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            Views and opinions of non-HDR UK groups or individuals that appear on this site do not necessarily reflect the
                            views of HDR UK.
                        </li>
                        <li>
                            HDR UK does not endorse or recommend any datasets, commercial products, processes or services linked from,
                            referred to, or provided on this site.
                        </li>
                        <li>
                            This site and the information, names, images, pictures, logos and icons contained therein are provided “AS IS”
                            and on an “AS AVAILABLE” basis without any representation or endorsement made and without warranty of any kind
                            (including any implied warranties), and HDR UK may update and change the site from time to time. We may suspend,
                            withdraw, discontinue or change all or any part of the site without notice. We will not be liable to you if for
                            any reason the site is unavailable at any time or for any period.
                        </li>
                        <li>
                            To the maximum extent permitted by law, HDR UK (including any of its member/partner organisations) shall not be
                            liable to you for
                        </li>
                        <ul className='termsBulletList'>
                            <li>
                                any loss or damage, whether in contract, tort (including negligence), breach of statutory duty, or
                                otherwise, even if foreseeable, arising under or in connection with use of, or inability to use our site or
                                use of or reliance on any content displayed on our site; and
                            </li>
                            <li>
                                any indirect or consequential loss or damage, loss of profits, sales, business or revenue, loss of
                                anticipated savings, loss or business opportunity, goodwill or reputation or business interruption.
                            </li>
                        </ul>
                        <li>
                            HDR UK does not guarantee that access to this site will be uninterrupted or error-free, nor does HDR UK
                            guarantee that this site or the server that makes it available are free of viruses, bugs or defects.
                        </li>
                    </ul>
                </p>

                <p id='terms-8' className='termsSubtitle'>
                    Requesting data sets via the site
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            If you request access to a dataset referenced on our site (following authentication through OpenAthens), your
                            request will be automatically forwarded to the relevant data custodian that maintains the dataset (
                            <b>“data custodian”</b>). HDR UK will not be party to any contract for the subsequent sharing of the dataset,
                            which in each case is a contract solely between you and the applicable data custodian (a{' '}
                            <b>“dataset sharing agreement”</b>). We do not have any rights or obligations under any dataset sharing
                            agreement.
                        </li>
                        <li>
                            HDR UK and its members/partners do not make any recommendations or endorsements regarding the datasets referred
                            to on the site and are not responsible for their availability, reliability or accuracy.
                        </li>
                        <li>
                            You must obtain professional or specialist advice before taking, or refraining from, any action on the basis of
                            the content on our site. This shall include conducting your own due diligence on any dataset that you may
                            request to use via this site.
                        </li>
                        <li>
                            To the maximum extent permitted by law, HDR UK (including any of its member/partner organisations) shall not be
                            liable to you for any loss or damage, whether in contract, tort (including negligence), breach of statutory
                            duty, or otherwise, even if foreseeable, arising under or in connection with any use of any dataset referred to
                            on our site, including, without limitation, any loss of profits, sales, business or revenue, loss of anticipated
                            savings, loss of business opportunity, goodwill or reputation or business interruption. You agree that you shall
                            pursue any claims for loss or damage arising from use of a dataset against the relevant data custodian and not
                            against HDR UK.
                        </li>
                    </ul>
                </p>
                <p id='terms-9' className='termsSubtitle'>
                    External links
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            Links from this site to other external sites are provided for convenience and information only. HDR UK and its
                            members/partners do not endorse the content or services delivered through these external sites and are not
                            responsible for their availability, reliability or accuracy. HDR UK have no control over the content of these
                            external sites. Permission to reproduce information from these external sites may be required from the external
                            site provider.
                        </li>
                        <li>
                            The existence of a link from any organisation’s site to HDR UK’s site does not imply that HDR UK endorses the
                            activities or views of that organisation.
                        </li>
                        <li>
                            We only link to sites (charity, business or otherwise) if they fulfil the following two conditions: HDR UK has
                            an existing partnership with the organisation and/or the link is relevant to the work of HDR UK.
                        </li>
                    </ul>
                </p>
                <p id='terms-10' className='termsSubtitle'>
                    Copyright (and other intellectual property rights) restrictions
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            HDR UK is the owner or the licensee of all intellectual property rights in this site, and in the material
                            published on it.
                        </li>
                        <li>
                            You may print off one copy, and may download extracts, of any page(s) from our site for your personal use and
                            you may draw the attention of others within your organisation to content posted on our site.
                        </li>
                        <li>
                            You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way,
                            and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from
                            any accompanying text.
                        </li>
                        <li>
                            Our status (and that of any identified contributors) as the authors of content on our site must always be
                            acknowledged.
                        </li>
                        <li>
                            You must not use any part of the content on our site for commercial purposes without obtaining a licence to do
                            so from us or our licensors.
                        </li>
                        <li>
                            If you print off, copy or download any part of our site in breach of the Terms and Conditions, your right to use
                            our site will cease immediately and you must, at our option, return or destroy any copies of the materials you
                            have made.
                        </li>
                    </ul>
                </p>
                <p id='terms-11' className='termsSubtitle'>
                    Restrictions on your use of the site
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            You agree to use this site only for lawful purposes, and in a manner which does not infringe the rights of, or
                            restrict, or inhibit the use and enjoyment of this site by any third party. Such restriction includes, without
                            limitation, conduct which is unlawful or which may harass or cause distress or inconvenience to any person and
                            the transmission of offensive material or disruption of normal flow of dialogue within this site.
                        </li>
                        <li>
                            You must not misuse our site by knowingly introducing any material that contains viruses, Trojan horses, worms,
                            logic bombs, time-bombs, keystroke loggers, spyware, adware or other harmful programs or material that is
                            malicious or technologically harmful. You must not attempt to gain unauthorised access to our site, the server
                            on which our site is stored or any server, computer or database connected to our site. You must not attack our
                            site via a denial-of-service attack or a distributed denial-of-service attack. By breaching this provision, you
                            would commit a criminal offence under the Computer Misuse Act 1990. We will report any breach to the relevant
                            law enforcement authorities and we will co-operate with those authorities by disclosing your identity to them.
                            In the event of such a breach, your right to use our site will cease immediately.
                        </li>
                    </ul>
                </p>
                <p id='terms-12' className='termsSubtitle'>
                    Accuracy of information
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            Neither HDR UK nor its members will be liable for any losses or damage that may result from use of the site as a
                            consequence of any inaccuracies in, or any omissions from, the information, which it may contain or which may be
                            accessed through the site.
                        </li>
                        <li>
                            We have made reasonable efforts to ensure that the information on this site is accurate at the time of
                            inclusion. However, we make no representations, warranties or guarantees, whether express or implied, that the
                            information on this site is free from technical inaccuracies or typographical errors or that the content is
                            accurate, complete or up to date. We are not liable for any error or omission in, or any failure to update, the
                            information on this site and any decisions based on the information are your sole responsibility.
                        </li>
                    </ul>
                </p>
                <p id='terms-13' className='termsSubtitle'>
                    Suspension and termination
                </p>
                <p>
                    If you breach any of the Terms and Conditions, we may immediately do any or all of the following (without limitation),
                    issue a warning to you, temporarily or permanently withdraw your right to use the site; suspend or terminate your
                    Account, issue legal proceedings against you for reimbursement of all costs resulting from the breach (including, but
                    not limited to, reasonable administrative and legal costs), take further legal action against you, and/or disclose such
                    information to law enforcement authorities as we reasonably feel is necessary to do so.
                </p>
                <p id='terms-14' className='termsSubtitle'>
                    Other important terms
                </p>
                <p>
                    <ul className='termsBulletList'>
                        <li>
                            If any of the Terms and Conditions should be determined to be illegal, invalid or otherwise unenforceable by
                            reason of the laws of any state or country in which the Terms and Conditions are intended to be effective, then
                            to the extent to which that Term and Condition is illegal, invalid and unenforceable within the jurisdiction, it
                            shall be severed and deleted from the Terms and Conditions and the remaining Terms and Conditions shall survive,
                            remain in full force and continue to be binding and enforceable.
                        </li>
                        <li>
                            The Terms and Conditions, their subject matter and their formation (and any non-contractual disputes or claims)
                            are governed by English law. We both agree to the exclusive jurisdiction of the courts of England and Wales.
                        </li>
                    </ul>
                </p>
                {props.showFormValidation ? (
                    <Form.Group className='pb-2'>
                        <div className='mt-2 advancedSearchAcceptTermsDiv'>
                            <Form.Control
                                type='checkbox'
                                className={formik.touched.terms && formik.errors.terms ? 'emptyFormInput checker' : 'checker'}
                                id='terms'
                                name='terms'
                                default={false}
                                checked={formik.values.terms}
                                onChange={formik.handleChange}
                                data-testid='terms'
                            />
                            <div id='accept-terms' className='gray800-14 advancedSearchAcceptTerms'>
                                I have read and understood the HDR Discovery Tool Terms of Use
                            </div>
                        </div>
                        <div className='mt-2'>
                            {formik.touched.terms && formik.errors.terms ? (
                                <div className='errorMessages ml-1' data-testid='advanced-search-terms-conditions-validation'>
                                    {formik.errors.terms}
                                </div>
                            ) : null}
                        </div>
                    </Form.Group>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default AdvancedSearchTAndCsContent;
