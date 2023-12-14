import type { Meta, StoryObj } from "@storybook/react";
import CMSPageTemplate1 from "./CMSPageTemplate1";

const meta: Meta<typeof CMSPageTemplate1> = {
    component: CMSPageTemplate1,
    title: "CMS/CMSPageTemplate1",
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CMSPageTemplate1>;

export const Default: Story = {
    args: {
        content: {
            id: "1",
            title: "Cohort Discovery Page",
            template: {
                template1Fields: {
                    bannerTitle: "Cohort Discovery",
                    ctaLink: {
                        title: "Button title",
                        url: "button/url",
                        target: "",
                    },
                    topRightPanel:
                        '<p><iframe loading="lazy" title="Cohort Discovery on the Health Data Research Innovation Gateway" width="500" height="281" src="https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></p>\n' +
                        "<p><!--more--></p>\n" +
                        "<p><!--more--></p>\n",
                    topLeftPanel:
                        "<h2>About Cohort Discovery</h2>\n" +
                        "<p>Cohort Discovery has the potential to save researchers time in finding datasets that are suitable for their research, and also save data custodians time by minimising enquiries to them about the content of the datasets they hold.</p>\n" +
                        "<p>Cohort Discovery is able to send a query to run against pseudonymised (de-identified) datasets that are hosted, managed and remain behind the firewall of a data custodian. The query looks for matches to a set of characteristics defined by the user and a numerical response (count) is returned from each dataset showing the number of people in the dataset who meet the characteristics selected.</p>\n" +
                        "<p>Researchers can then understand whether a dataset contains a cohort (group) of interest and if yes, submit data access request(s) to the appropriate data custodian(s).</p>\n" +
                        '<p>Statistical disclosure control policies are in place for each data custodian, so low numbers are excluded from query results and results may also be rounded to eliminate any potential risk of identification.This functionality has been developed as part of the CO-CONNECT programme and further information can be found on their <a href="https://co-connect.ac.uk/">website</a>. The summary metadata of the current datasets that are available to query via Cohort Discovery can be found in this <a href="https://www.healthdatagateway.org/">Collection</a> on the Gateway.</p>\n',
                    middlePanel:
                        "<h3>How you can request access to Cohort Discovery</h3>\n" +
                        "<p>In line with the UK Health Data Research Alliance principles for participation we use a proportionate governance approach based on the Five Safes Framework. For accessing Cohort Discovery, we focus on Safe People and Safe Projects as Safe Setting, Safe Data and Safe Outputs are managed by the data and technology partners.</p>\n" +
                        "<p>To access Cohort Discovery you must demonstrate your Safe People status either as a researcher, NHS analyst or equivalent. This will be assessed based on your Gateway registered user profile, including institutional email address, role description and ORCID record.</p>\n" +
                        "<p>Please ensure you are a registered user of the gateway and that your profile is up to date and includes your institutional email address and role description before you submit a request to access Cohort Discovery.</p>\n" +
                        "<p>To satisfy a proportionate assessment of Safe Project, you will also need to provide information on why you are requesting access, which will be reviewed to ensure there is potential for public benefit. Access, if granted, will be for a period of 6-months after which you will need to renew.</p>\n" +
                        "<p>If, after your application, your Safe People status or the potential public benefit is indeterminate, we will contact you for further information and reserve the right not to provide access.</p>\n" +
                        '<p><img loading="lazy" decoding="async" class=" wp-image-130 aligncenter" src="https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image-300x274.png" alt="Search and analyse medical groups" width="395" height="361" srcset="https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image-300x274.png 300w, https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image.png 601w" sizes="(max-width: 395px) 100vw, 395px" /></p>\n',
                },
            },
        },
    },
};
