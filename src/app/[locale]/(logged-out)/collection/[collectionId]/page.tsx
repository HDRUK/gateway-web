import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import DataUsesContent from "@/components/DataUsesContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import MarkDownParsed from "@/components/MarkDownParsed";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getReducedCollection } from "@/utils/api";
import { toTitleCase } from "@/utils/string";
import ActionBar from "./components/ActionBar";
import DatasetsContent from "./components/DatasetsContent";
import { collectionSections } from "./config";
import metaData from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "Collection",
        description: ""
    })

const TRANSLATION_PATH = "pages.collection";

export default async function CollectionItemPage({
    params,
}: {
    params: { collectionId: string };
}) {
    const { collectionId } = params;
    const cookieStore = cookies();
    const t = await getTranslations(TRANSLATION_PATH);
    const collection = {
        "id": 98,
        "name": "UK Longitudinal Linkage Collaboration (UK LLC)",
        "description": "UK Longitudinal Linkage Collaboration (UK LLC) is the national Trusted Research Environment (TRE) for longitudinal research. Led by the Universities of Bristol and Edinburgh, in collaboration with UCL, SeRP UK, Swansea University, University of Leicester and St George&amp;#039;s, University of London, it is a collaborative endeavour with many of the UK&amp;rsquo;s most established longitudinal population studies (LPS). UK LLC&amp;rsquo;s mission is to provide a data linkage resource to its partner LPS and to provide a simple one-application process to UK based researchers applying to access linked longitudinal data. The data in the UK LLC TRE is provided by over 280,000 participants who volunteer to be part of their LPS. The LPS retain control of who can access their participants&amp;#039; linked data and all permissions set by participants remain in place.For more information please visit: www.ukllc.ac.uk. The LPS collaborating in UK LLC are: Airwave Health Monitoring Study, Avon Longitudinal Study of Parents and Children (ALSPAC), 1970 British Cohort Study (BCS70), Born in Bradford (BIB), English Longitudinal Study of Ageing (ELSA), The European Prospective Investigation into Cancer (EPIC) Norfolk Study, Extended Cohort for E-health, Environment and DNA (EXCEED), The Fenland Study, Generation Scotland, Genetic Links to Anxiety and Depression Study (GLAD), The Millennium Cohort Study (MCS), 1958 National Child Development Study (NCDS), Next Steps, Northern Ireland Cohort for the Longitudinal Study of Ageing (NICOLA), MRC National Survey of Health and Development Cohort/1946 Birth Cohort (NSHD/1946BC), National Institute of Health Research (NIHR) BioResource COVID-19 Psychiatry and Neurological Genetics (COPING) Study, Southall and Brent Revisited (SABRE) (non-linked data only), TRACK-COVID Study, TwinsUK, Twins Early Development Study (TEDS), Understanding Society - the UK Household Longitudinal Study (UKHLS). Active Users: 60 | Active Projects: 25Pricing: Centrally funded - currently no charge at the point of access.  ---### SAFE People - Login &amp;amp; Access  &amp;bull; All applicants must provide a CV detailing evidence of a research career and employment by a recognised UK research organisation&amp;bull; All approved users must be an Accredited Researcher under the Digital Economy Act &amp;bull; All approved users must sign a Data User Responsibilities Agreement (DURA) and be covered by a Data Access Agreement (DAA)✓ Login: Login to Virtual Desktop Infrastructure (VDI) via 2FA  ✓ Minimum Requirement: See requirements detailed above ✗ International Access: Not permitted---### SAFE Settings - Compute &amp;amp; Services✓ Secure eResearch Platform (SeRP) UK environment✓ Options for Windows 10 VDI - 4C/16GB &amp;ndash; 8C/32GB &amp;ndash; 16C/128GB -128C/1.5TB (Limited)✗ No ability to modify OS✗ Managed Data analytics capabilities: None provided ✗ No federated queries✗ No federated analytics---### SAFE Settings - Security Certifications and Measures✓ Security Certifications: UK LLC is ISO 27001 certified, accredited by UK Statistics Authority as a processor under the DEA and completes the annual NHS Data Security &amp;amp; Protection Toolkit  ✓ Security Measures: UK LLC has developed an Information Security Management System to the exacting standards required by ISO 27001 and DEA, in particular  ✓ No VM direct access; access only through VDI✓ No VM access control (no USB, copy/paste, internet access whitelisted or internal mirrors)  ---### SAFE Settings - Software access  ✓ Default software: Office, R, Python, Conda, SPSS, STATA, SAS, Jupyter Notebook, Eclipse, VS Code, DB tooling  ✓ Code/library import: Whitelisted package libraries for R, Python, Conda, SAS, STATA, SPSS. Extra packages can be added on request. AV/Malware, SEIM and N/W monitoring  ✓ Collaboration Software: Git, Wiki, Confluence, shared filestore, shared DB  ---### SAFE Data - Data Access Mechanisms✓ Data Provisioning: Scoped and minimised data provided as views in an RDBMS with access to a filestore, git etc.  ✓ Reduce re-identification risk by: pseudonymisation, minimising dataset, encryption and encryption of linkage keys, small number output suppression✓ Receive Data: Ability to receive data upon special request  -&amp;bull; ✓ Linked Data: External data linked via data linkage mechanism  -&amp;bull; ✓ Open Data: A number of core datasets are provisioned to all approved researchers ✓ Record Linkage: Deterministic, probabilistic linkage via Trusted Third Party ---### SAFE Outputs - Data Output/export  ✓ Individual level data cannot be exported; only aggregate level graphs and tables can be exported. All outputs must go through human SDC review. Code and methods can be exported✓ Export plans: Same as above✓ Data transmitted to other SAFE Settings: None✓ Statistical disclosure control process in place",
        "image_link": "https://media.prod.hdruk.cloud/collections/42a2466f-9a31-431d-859e-4cb8604e0f39.png",
        "enabled": true,
        "public": 1,
        "counter": 423,
        "created_at": "2024-10-08T13:04:50.000000Z",
        "updated_at": "2024-11-01T09:22:25.000000Z",
        "deleted_at": null,
        "mongo_object_id": "64881e635d846cf02374059d",
        "mongo_id": "1952103092377484",
        "updated_on": null,
        "team_id": 39,
        "status": "ACTIVE",
        "keywords": [],
        "tools": [],
        "dur": [],
        "publications": [],
        "dataset_versions": [
            {
                "id": 23,
                "dataset_id": 23,
                "shortTitle": "Avon Longitudinal Study of Parents and Children",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 23
                }
            },
            {
                "id": 33,
                "dataset_id": 33,
                "shortTitle": "Emergency Care Data Set (ECDS)",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 33
                }
            },
            {
                "id": 34,
                "dataset_id": 34,
                "shortTitle": "Improving Access to Psychological Therapies Data Set",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 34
                }
            },
            {
                "id": 35,
                "dataset_id": 35,
                "shortTitle": "Covid-19 Second Generation Surveillance System",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 35
                }
            },
            {
                "id": 36,
                "dataset_id": 36,
                "shortTitle": "Community Services Data Set",
                "populationSize": 778520,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 36
                }
            },
            {
                "id": 37,
                "dataset_id": 37,
                "shortTitle": "Mental Health Services Data Set",
                "populationSize": 1358959,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 37
                }
            },
            {
                "id": 39,
                "dataset_id": 39,
                "shortTitle": "GPES Data for Pandemic Planning and Research (COVID-19)",
                "populationSize": 56441600,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 39
                }
            },
            {
                "id": 41,
                "dataset_id": 41,
                "shortTitle": "COVID-19 Vaccination Adverse Reaction",
                "populationSize": 2600,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 41
                }
            },
            {
                "id": 42,
                "dataset_id": 42,
                "shortTitle": "Hospital Episode Statistics Critical Care",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 42
                }
            },
            {
                "id": 43,
                "dataset_id": 43,
                "shortTitle": "Hospital Episode Statistics Admitted Patient Care",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 43
                }
            },
            {
                "id": 44,
                "dataset_id": 44,
                "shortTitle": "Hospital Episode Statistics Outpatients",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 44
                }
            },
            {
                "id": 46,
                "dataset_id": 46,
                "shortTitle": "Covid-19 UK Non-hospital Antigen Testing Results",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 46
                }
            },
            {
                "id": 47,
                "dataset_id": 47,
                "shortTitle": "Medicines dispensed in Primary Care (NHSBSA data)",
                "populationSize": 18824070,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 47
                }
            },
            {
                "id": 48,
                "dataset_id": 48,
                "shortTitle": "Hospital Episode Statistics Accident and Emergency",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 48
                }
            },
            {
                "id": 202,
                "dataset_id": 202,
                "shortTitle": "TRACK-COVID",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 202
                }
            },
            {
                "id": 283,
                "dataset_id": 283,
                "shortTitle": "Extended Cohort for E-health, Environment and DNA (EXCEED)",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 283
                }
            },
            {
                "id": 312,
                "dataset_id": 312,
                "shortTitle": "Millennium Cohort Study Dataset (MCSD)",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 312
                }
            },
            {
                "id": 413,
                "dataset_id": 413,
                "shortTitle": "Generation Scotland: Scottish Family Health Study",
                "populationSize": 24000,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 413
                }
            },
            {
                "id": 701,
                "dataset_id": 701,
                "shortTitle": "UK Longitudinal Linkage Collaboration (UK LLC)",
                "populationSize": 280000,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 701
                }
            },
            {
                "id": 728,
                "dataset_id": 728,
                "shortTitle": "TwinsUK",
                "populationSize": 15000,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 728
                }
            },
            {
                "id": 730,
                "dataset_id": 730,
                "shortTitle": "The EPIC-Norfolk Study",
                "populationSize": 25639,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 730
                }
            },
            {
                "id": 731,
                "dataset_id": 731,
                "shortTitle": "The Fenland Study",
                "populationSize": 12435,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 731
                }
            },
            {
                "id": 756,
                "dataset_id": 756,
                "shortTitle": "Growing up in Bradford (BiB)",
                "populationSize": 12619,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 756
                }
            },
            {
                "id": 757,
                "dataset_id": 757,
                "shortTitle": "The Airwave Health Monitoring Study",
                "populationSize": 53000,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 757
                }
            },
            {
                "id": 758,
                "dataset_id": 758,
                "shortTitle": "The 1970 British Cohort Study (BCS70)",
                "populationSize": 8581,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 758
                }
            },
            {
                "id": 762,
                "dataset_id": 762,
                "shortTitle": "1958 National Child Development Study (NCDS)",
                "populationSize": 9137,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 762
                }
            },
            {
                "id": 763,
                "dataset_id": 763,
                "shortTitle": "English Longitudinal Study of Ageing (ELSA)",
                "populationSize": 7222,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 763
                }
            },
            {
                "id": 765,
                "dataset_id": 765,
                "shortTitle": "Next Steps",
                "populationSize": 7707,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 765
                }
            },
            {
                "id": 832,
                "dataset_id": 832,
                "shortTitle": "MRC National Survey of Health and Development (NSHD, 1946 British Birth Cohort)",
                "populationSize": 5362,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 832
                }
            },
            {
                "id": 858,
                "dataset_id": 858,
                "shortTitle": "Covid-19 UK Non-hospital Antibody Testing Results",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 858
                }
            },
            {
                "id": 872,
                "dataset_id": 872,
                "shortTitle": "COVID-19 Vaccination Status",
                "populationSize": 17521000,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 872
                }
            },
            {
                "id": 880,
                "dataset_id": 880,
                "shortTitle": "Cancer Registration Data",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 880
                }
            },
            {
                "id": 881,
                "dataset_id": 881,
                "shortTitle": "COVID-19 SARI-Watch (formerly CHESS)",
                "populationSize": -1,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 881
                }
            },
            {
                "id": 882,
                "dataset_id": 882,
                "shortTitle": "Understanding Society",
                "populationSize": 39802,
                "datasetType": "Health and disease",
                "pivot": {
                    "collection_id": 98,
                    "dataset_version_id": 882
                }
            }
        ],
        "team": {
            "id": 39,
            "pid": "58819e96-faf2-4e59-92b2-514603eb9922",
            "created_at": "2024-10-08T11:18:22.000000Z",
            "updated_at": "2024-10-09T13:13:38.000000Z",
            "deleted_at": null,
            "name": "UK Longitudinal Linkage Collaboration (UK LLC)",
            "enabled": true,
            "allows_messaging": false,
            "workflow_enabled": false,
            "access_requests_management": false,
            "uses_5_safes": false,
            "is_admin": false,
            "team_logo": "/teams/uk-llc.jpg",
            "member_of": "OTHER",
            "contact_point": null,
            "application_form_updated_by": "Qresearch webapp",
            "application_form_updated_on": "0001-01-01 00:00:00",
            "mongo_object_id": "607db9c6e1f9d3704d570d83",
            "notification_status": false,
            "is_question_bank": false,
            "is_provider": false,
            "url": null,
            "introduction": null,
            "dar_modal_content": null,
            "service": null
        },
        "users": [
            {
                "id": 1,
                "name": "HDRUK Developers",
                "firstname": "HDRUK",
                "lastname": "Developers",
                "email": "developers@hdruk.ac.uk",
                "secondary_email": "ansley39@example.com",
                "preferred_email": "secondary",
                "email_verified_at": "2024-10-08T11:03:14.000000Z",
                "provider": "service",
                "created_at": "2024-10-08T11:03:14.000000Z",
                "updated_at": "2024-10-08T11:03:14.000000Z",
                "deleted_at": null,
                "sector_id": 2,
                "organisation": "cum et molestiae",
                "bio": "Tempore reprehenderit minus eaque cupiditate nesciunt.",
                "domain": "marks.net",
                "link": "http://www.kris.biz/voluptas-est-molestiae-sint-vitae-illo",
                "orcid": "https://orcid.org/44902397",
                "contact_feedback": 0,
                "contact_news": 1,
                "mongo_id": 27555794,
                "mongo_object_id": "ad",
                "is_admin": 1,
                "terms": false,
                "hubspot_id": null,
                "rquestroles": [
                    "GENERAL_ACCESS"
                ],
                "pivot": {
                    "collection_id": 98,
                    "user_id": 1,
                    "role": "CREATOR"
                }
            }
        ]
    };

    if (!collection) notFound();

    const {
        name,
        image_link,
        description,
        tools,
        dur,
        dataset_versions,
        publications,
    } = collection;

    const activeLinkList = collectionSections.map(({ sectionName: label }) => {
        return { label };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={toTitleCase(name)}
                            src={image_link || StaticImages.BASE.placeholder}
                        />
                        <Typography variant="h1" sx={{ ml: 2 }}>
                            {name}
                        </Typography>
                    </Box>

                    <Box sx={{ px: 6, py: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <ActionBar />
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h3" sx={{ mb: 1 }}>
                                {t("introTitle")}
                            </Typography>
                            <MarkDownParsed>{description}</MarkDownParsed>
                        </Box>
                        <Box>
                            <DatasetsContent
                                datasets={dataset_versions}
                                anchorIndex={1}
                            />

                            <ToolsContent
                                tools={tools}
                                anchorIndex={2}
                                translationPath={TRANSLATION_PATH}
                            />

                            <DataUsesContent
                                datauses={dur}
                                anchorIndex={3}
                                translationPath={TRANSLATION_PATH}
                            />

                            <PublicationsContent
                                publications={publications}
                                anchorIndex={4}
                                translationPath={TRANSLATION_PATH}
                            />
                        </Box>
                    </Box>
                </>
            }
        />
    );
}
