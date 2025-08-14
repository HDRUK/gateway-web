import { get } from "lodash";
import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { DataStatus } from "@/consts/application";
import {
    getFormHydration,
    getSchemaFromTraser,
    getTeam,
    getTeamDataset,
    getTeamIdFromPid,
    getUser,
} from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import EditDataset from "../components/CreateDataset";
import { extractNamesFromDataType } from "@/utils/extractNamesFromDataTypes";
import { tester } from "@/app/api/tester/route";
import { string } from "yup";

export const metadata = metaData(
    {
        title: "Dataset - My Account",
        description: "",
    },
    noFollowRobots
);
const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME;
// const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION;
const SCHEMA_VERSION = '4.0.0'
export default async function TeamDatasetPage({
    params,
    searchParams,
}: {
    params: { teamId: string; status: string; datasetId: string };
    searchParams: { [key: string]: string | undefined };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const isDraft = searchParams.status === DataStatus.DRAFT;

    // const dataset = await getTeamDataset(
    //     cookieStore,
    //     params.teamId,
    //     params.datasetId,
    //     isDraft ? "" : SCHEMA_NAME,
    //     isDraft ? "" : SCHEMA_VERSION
    // );

    const dataset = {
        "id": 757,
        "mongo_object_id": "629f301a83ac54e83b3b6335",
        "mongo_id": "830512912458871",
        "mongo_pid": "98bfe17f-be12-47b1-943a-2d3a621b7618",
        "datasetid": "51f9de9e-5fcd-4629-bdfc-7719359a7ec6",
        "pid": "a0224326-efb0-450c-be89-bbf8ebd8de41",
        "source": null,
        "discourse_topic_id": 0,
        "is_cohort_discovery": false,
        "commercial_use": 0,
        "state_id": 0,
        "uploader_id": 0,
        "metadataquality_id": 0,
        "user_id": 1,
        "team_id": 58,
        "views_count": 0,
        "views_prev_count": 0,
        "has_technical_details": 1,
        "created": "2024-10-08 11:31:50",
        "updated": "2025-03-07 14:23:28",
        "submitted": "2024-10-08 11:31:50",
        "published": null,
        "created_at": "2024-10-08T11:31:50.000000Z",
        "updated_at": "2025-03-07T14:23:28.000000Z",
        "deleted_at": null,
        "create_origin": "MANUAL",
        "status": "DRAFT",
        "durs_count": 0,
        "publications_count": 0,
        "tools_count": 0,
        "collections_count": 2,
        "spatialCoverage": [
            {
                "id": 1,
                "created_at": "2024-10-08T11:03:10.000000Z",
                "updated_at": "2024-10-08T11:03:10.000000Z",
                "region": "England",
                "enabled": true,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2,
                "created_at": "2024-10-08T11:03:10.000000Z",
                "updated_at": "2024-10-08T11:03:10.000000Z",
                "region": "Northern Ireland",
                "enabled": true,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 3,
                "created_at": "2024-10-08T11:03:10.000000Z",
                "updated_at": "2024-10-08T11:03:10.000000Z",
                "region": "Scotland",
                "enabled": true,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 4,
                "created_at": "2024-10-08T11:03:10.000000Z",
                "updated_at": "2024-10-08T11:03:10.000000Z",
                "region": "Wales",
                "enabled": true,
                "dataset_version_ids": [
                    757
                ]
            }
        ],
        "durs": [],
        "publications": [],
        "named_entities": [
            {
                "id": 15,
                "name": "Plant Roots",
                "created_at": "2024-10-08T11:28:09.000000Z",
                "updated_at": "2024-10-08T11:28:09.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 35,
                "name": "Study",
                "created_at": "2024-10-08T11:28:10.000000Z",
                "updated_at": "2024-10-08T11:28:10.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 52,
                "name": "Occupations",
                "created_at": "2024-10-08T11:28:12.000000Z",
                "updated_at": "2024-10-08T11:28:12.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 88,
                "name": "Cohort",
                "created_at": "2024-10-08T11:28:15.000000Z",
                "updated_at": "2024-10-08T11:28:15.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 93,
                "name": "Long-term",
                "created_at": "2024-10-08T11:28:15.000000Z",
                "updated_at": "2024-10-08T11:28:15.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 99,
                "name": "Tooth root structure",
                "created_at": "2024-10-08T11:28:16.000000Z",
                "updated_at": "2024-10-08T11:28:16.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 165,
                "name": "Population Group",
                "created_at": "2024-10-08T11:28:18.000000Z",
                "updated_at": "2024-10-08T11:28:18.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 178,
                "name": "Health",
                "created_at": "2024-10-08T11:28:18.000000Z",
                "updated_at": "2024-10-08T11:28:18.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 380,
                "name": "longitudinal studies",
                "created_at": "2024-10-08T11:28:28.000000Z",
                "updated_at": "2024-10-08T11:28:28.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 1021,
                "name": "Monitoring - action",
                "created_at": "2024-10-08T11:28:56.000000Z",
                "updated_at": "2024-10-08T11:28:56.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 1116,
                "name": "Staff",
                "created_at": "2024-10-08T11:29:00.000000Z",
                "updated_at": "2024-10-08T11:29:00.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 1197,
                "name": "Cohort Studies",
                "created_at": "2024-10-08T11:29:06.000000Z",
                "updated_at": "2024-10-08T11:29:06.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 1689,
                "name": "Body tissue",
                "created_at": "2024-10-08T11:29:52.000000Z",
                "updated_at": "2024-10-08T11:29:52.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 1722,
                "name": "Great Britain",
                "created_at": "2024-10-08T11:29:55.000000Z",
                "updated_at": "2024-10-08T11:29:55.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2303,
                "name": "C1549461",
                "created_at": "2024-10-08T11:31:51.000000Z",
                "updated_at": "2024-10-08T11:31:51.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2304,
                "name": "police",
                "created_at": "2024-10-08T11:31:52.000000Z",
                "updated_at": "2024-10-08T11:31:52.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2558,
                "name": "OMOP generated",
                "created_at": "2025-01-06T16:17:50.000000Z",
                "updated_at": "2025-01-06T16:17:50.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2570,
                "name": "85077000",
                "created_at": "2025-01-06T16:18:09.000000Z",
                "updated_at": "2025-01-06T16:18:09.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2610,
                "name": "95715-9",
                "created_at": "2025-01-06T16:21:02.000000Z",
                "updated_at": "2025-01-06T16:21:02.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2611,
                "name": "D044382",
                "created_at": "2025-01-06T16:21:08.000000Z",
                "updated_at": "2025-01-06T16:21:08.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2612,
                "name": "LP420273-7",
                "created_at": "2025-01-06T16:21:08.000000Z",
                "updated_at": "2025-01-06T16:21:08.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2613,
                "name": "Population Groups",
                "created_at": "2025-01-06T16:21:08.000000Z",
                "updated_at": "2025-01-06T16:21:08.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2646,
                "name": "CDM1031",
                "created_at": "2025-01-06T16:23:16.000000Z",
                "updated_at": "2025-01-06T16:23:16.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 2647,
                "name": "CDM382",
                "created_at": "2025-01-06T16:23:16.000000Z",
                "updated_at": "2025-01-06T16:23:16.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 4268,
                "name": "360152008",
                "created_at": "2025-01-06T18:02:59.000000Z",
                "updated_at": "2025-01-06T18:02:59.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5140,
                "name": "410613002",
                "created_at": "2025-01-07T13:00:15.000000Z",
                "updated_at": "2025-01-07T13:00:15.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5144,
                "name": "Tooth part",
                "created_at": "2025-01-07T13:00:18.000000Z",
                "updated_at": "2025-01-07T13:00:18.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5174,
                "name": "Clinical terms not yet categorized",
                "created_at": "2025-01-07T13:00:50.000000Z",
                "updated_at": "2025-01-07T13:00:50.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5175,
                "name": "LP248771-0",
                "created_at": "2025-01-07T13:00:55.000000Z",
                "updated_at": "2025-01-07T13:00:55.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5181,
                "name": "PUBLICHEALTH",
                "created_at": "2025-01-07T13:01:07.000000Z",
                "updated_at": "2025-01-07T13:01:07.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5182,
                "name": "Public Health",
                "created_at": "2025-01-07T13:01:19.000000Z",
                "updated_at": "2025-01-07T13:01:19.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5765,
                "name": "129265001",
                "created_at": "2025-01-07T13:30:18.000000Z",
                "updated_at": "2025-01-07T13:30:18.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5770,
                "name": "Evaluation - action",
                "created_at": "2025-01-07T13:30:39.000000Z",
                "updated_at": "2025-01-07T13:30:39.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5793,
                "name": "85756007",
                "created_at": "2025-01-07T13:32:19.000000Z",
                "updated_at": "2025-01-07T13:32:19.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 5795,
                "name": "Body tissue structure",
                "created_at": "2025-01-07T13:32:19.000000Z",
                "updated_at": "2025-01-07T13:32:19.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 6815,
                "name": "Root of tooth",
                "created_at": "2025-01-07T16:16:03.000000Z",
                "updated_at": "2025-01-07T16:16:03.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 6832,
                "name": "Tooth root structure (body structure)",
                "created_at": "2025-01-07T16:16:12.000000Z",
                "updated_at": "2025-01-07T16:16:12.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 6970,
                "name": "Group, Population",
                "created_at": "2025-01-07T16:17:45.000000Z",
                "updated_at": "2025-01-07T16:17:45.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 6973,
                "name": "Groups, Population",
                "created_at": "2025-01-07T16:17:45.000000Z",
                "updated_at": "2025-01-07T16:17:45.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 6986,
                "name": "Nominal; PH; Point in time; Public Health; PUBLICHEALTH; Random; Typ",
                "created_at": "2025-01-07T16:17:57.000000Z",
                "updated_at": "2025-01-07T16:17:57.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 7016,
                "name": "人群分组:类型:时间点:^患者:名义型",
                "created_at": "2025-01-07T16:18:21.000000Z",
                "updated_at": "2025-01-07T16:18:21.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 8033,
                "name": "91723000",
                "created_at": "2025-01-07T16:35:58.000000Z",
                "updated_at": "2025-01-07T16:35:58.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 8049,
                "name": "Anatomical structure",
                "created_at": "2025-01-07T16:36:26.000000Z",
                "updated_at": "2025-01-07T16:36:26.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 10323,
                "name": "Monitoring - action (qualifier value)",
                "created_at": "2025-01-07T16:58:57.000000Z",
                "updated_at": "2025-01-07T16:58:57.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 11728,
                "name": "Body tissue structure (body structure)",
                "created_at": "2025-01-07T17:37:21.000000Z",
                "updated_at": "2025-01-07T17:37:21.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 11804,
                "name": "Tissue",
                "created_at": "2025-01-07T17:38:22.000000Z",
                "updated_at": "2025-01-07T17:38:22.000000Z",
                "deleted_at": null,
                "dataset_version_ids": [
                    757
                ]
            }
        ],
        "collections": [
            {
                "id": 14,
                "name": "HDR UK Multi-omics Consortium",
                "description": "Genetics has transformed our understanding of how variation in DNA can influence risk of developing conditions, such as cancer and heart disease. Studies that can combine this genetic information with other blood-based factors &ndash; including proteins, metabolites and lipids &ndash; and health records, have the potential to provide more direct insight into disease aetiology and prediction. A key challenge so far, however, has been accessing this information at sufficient scale.\n\nThe development of a National Multi-omics Consortium aims to address this challenge by bringing together information on participants from multiple studies to enhance scientific power, breadth, and robustness. The Consortium is one of the major initiatives within HDRUK&rsquo;s Understanding the Causes of Disease programme, led by HDR UK Researcher Dr Adam Butterworth. It will bring together existing and unique data assets, maximising their value within an open and collaborative national team. \n\nFrom it&#039;s conception, the Consortium was designed to include nine longitudinal UK population cohorts within the HDR UK network, comprising over 750,000 participants:\n- AIRWAVE Health Monitoring\n- COMPARE Study\n- EPIC-Norfolk\n- The Fenland Study\n- Generation Scotland\n- GoDARTS\n- INTERVAL Study \n- UCLEB Consortium\n- UK Biobank\n\nAdditional cohorts have since joined, including:\n- ALSPAC\n- Born in Bradford\n- EXCEED\n- Viking Genes (including both Viking &amp; Orcades studies)\n\nMore info can be found [here](https://www.hdruk.ac.uk/projects/a-national-multi-omics-consortium-to-inform-disease-aetiology-and-prediction/). This collection will feature datasets, projects and outputs from the HDR UK Multi-omics Consortium.",
                "image_link": "/collections/043ac31e-da63-4e21-aadb-8777f6534cfc.png",
                "enabled": true,
                "public": 1,
                "counter": 642,
                "created_at": "2024-10-08T13:03:08.000000Z",
                "updated_at": "2024-10-31T15:09:51.000000Z",
                "deleted_at": null,
                "mongo_object_id": "60265c012c78ca4d4e96baff",
                "mongo_id": "7189037514031495",
                "updated_on": null,
                "team_id": 21,
                "status": "ACTIVE",
                "dataset_version_ids": [
                    757
                ]
            },
            {
                "id": 98,
                "name": "UK Longitudinal Linkage Collaboration (UK LLC)",
                "description": "{&quot;type&quot;:&quot;doc&quot;,&quot;content&quot;:[{&quot;type&quot;:&quot;paragraph&quot;,&quot;content&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;UK Longitudinal Linkage Collaboration (UK LLC) is the national Trusted Research Environment (TRE) for longitudinal research. Led by the Universities of Bristol and Edinburgh, in collaboration with UCL, SeRP UK, Swansea University, University of Leicester and St George&#039;s, University of London, it is a collaborative endeavour with many of the UK&#039;s most established longitudinal population studies (LPS). UK LLC&#039;s mission is to provide a data linkage resource to its partner LPS and to provide a simple one-application process to UK based researchers applying to access linked longitudinal data. The data in the UK LLC TRE is provided by over 280,000 participants who volunteer to be part of their LPS. The LPS retain control of who can access their participants&#039; linked data and all permissions set by participants remain in place.\\n\\nFor more information please visit: www.ukllc.ac.uk \\n\\nThe LPS collaborating in UK LLC are: Airwave Health Monitoring Study, Avon Longitudinal Study of Parents and Children (ALSPAC), 1970 British Cohort Study (BCS70), Born in Bradford (BIB), English Longitudinal Study of Ageing (ELSA), The European Prospective Investigation into Cancer (EPIC) Norfolk Study, Extended Cohort for E-health, Environment and DNA (EXCEED), The Fenland Study, Generation Scotland, Genetic Links to Anxiety and Depression Study (GLAD), The Millennium Cohort Study (MCS), 1958 National Child Development Study (NCDS), Next Steps, Northern Ireland Cohort for the Longitudinal Study of Ageing (NICOLA), MRC National Survey of Health and Development Cohort/1946 Birth Cohort (NSHD/1946BC), National Institute of Health Research (NIHR) BioResource COVID-19 Psychiatry and Neurological Genetics (COPING) Study, Southall and Brent Revisited (SABRE) (non-linked data only), TRACK-COVID Study, TwinsUK, Twins Early Development Study (TEDS), Understanding Society - the UK Household Longitudinal Study (UKHLS).&quot;}]},{&quot;type&quot;:&quot;paragraph&quot;,&quot;content&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;3  Active Users: 60 | Active Projects: 25 | Pricing: Centrally funded - currently no charge at the point of access.  --- ### SAFE People - Login &amp; Access &amp;bull; All applicants must provide a CV detailing evidence of a research career and employment by a recognised UK research organisation &amp;bull; All approved users must be an Accredited Researcher under the Digital Economy Act &amp;bull; All approved users must sign a Data User Responsibilities Agreement (DURA) and be covered by a Data Access Agreement (DAA) ✓ Login: Login to Virtual Desktop Infrastructure (VDI) via 2FA ✓ Minimum Requirement: See requirements detailed above ✗ International Access: Not permitted  --- ### SAFE Settings - Compute &amp; Services ✓ Secure eResearch Platform (SeRP) UK environment ✓ Options for Windows 10 VDI - 4C/16GB &amp;ndash; 8C/32GB &amp;ndash; 16C/128GB -128C/1.5TB (Limited) ✗ No ability to modify OS ✗ Managed Data analytics capabilities: None provided  ✗ No federated queries ✗ No federated analytics  --- ### SAFE Settings - Security Certifications and Measures ✓ Security Certifications: UK LLC is ISO 27001 certified, accredited by UK Statistics Authority as a processor under the DEA and completes the annual NHS Data Security &amp;amp; Protection Toolkit   ✓ Security Measures: UK LLC has developed an Information Security Management System to the exacting standards required by ISO 27001 and DEA, in particular   ✓ No VM direct access; access only through VDI ✓ No VM access control (no USB, copy/paste, internet access whitelisted or internal mirrors)  --- ### SAFE Settings - Software access   ✓ Default software: Office, R, Python, Conda, SPSS, STATA, SAS, Jupyter Notebook, Eclipse, VS Code, DB tooling   ✓ Code/library import: Whitelisted package libraries for R, Python, Conda, SAS, STATA, SPSS. Extra packages can be added on request. AV/Malware, SEIM and N/W monitoring   ✓ Collaboration Software: Git, Wiki, Confluence, shared filestore, shared DB  --- ### SAFE Data - Data Access Mechanisms ✓ Data Provisioning: Scoped and minimised data provided as views in an RDBMS with access to a filestore, git etc.   ✓ Reduce re-identification risk by: pseudonymisation, minimising dataset, encryption and encryption of linkage keys, small number output suppression ✓ Receive Data: Ability to receive data upon special request   -&amp;bull; ✓ Linked Data: External data linked via data linkage mechanism   -&amp;bull; ✓ Open Data: A number of core datasets are provisioned to all approved researchers  ✓ Record Linkage: Deterministic, probabilistic linkage via Trusted Third Party  --- ### SAFE Outputs - Data Output/export   ✓ Individual level data cannot be exported; only aggregate level graphs and tables can be exported. All outputs must go through human SDC review. Code and methods can be exported ✓ Export plans: Same as above ✓ Data transmitted to other SAFE Settings: None ✓ Statistical disclosure control process in place&quot;}]}]}",
                "image_link": "https://media.prod.hdruk.cloud/collections/42a2466f-9a31-431d-859e-4cb8604e0f39.png",
                "enabled": true,
                "public": 1,
                "counter": 423,
                "created_at": "2024-10-08T13:04:50.000000Z",
                "updated_at": "2024-11-21T11:54:04.000000Z",
                "deleted_at": null,
                "mongo_object_id": "64881e635d846cf02374059d",
                "mongo_id": "1952103092377484",
                "updated_on": null,
                "team_id": 39,
                "status": "ACTIVE",
                "dataset_version_ids": [
                    757
                ]
            }
        ],
        "versions": [
            {
                "id": 757,
                "created_at": "2024-10-08T11:31:50.000000Z",
                "updated_at": "2025-03-24T19:23:43.000000Z",
                "deleted_at": null,
                "active_date": null,
                "dataset_id": 757,
                "metadata": {
                    "metadata": {
                        "omics": null,
                        "linkage": {
                            "tools": "http://www.google.com;,;https://github.com/HDRUK/papers",
                            "dataUses": null,
                            "isReferenceIn": null,
                            "datasetLinkage": null,
                            "investigations": "",
                            "associatedMedia": "https://police-health.org.uk/study-data-documentation",
                            "isGeneratedUsing": null,
                            "publicationAboutDataset": [],
                            "publicationUsingDataset": []
                        },
                        "summary": {
                            "title": "The Airwave Health Monitoring Study",
                            "doiName": "10.1016/j.envres.2014.07.025",
                            "abstract": "The Airwave Health Monitoring Study (AHMS) is a long-term occupational observational cohort study and tissue bank following up the health of c. 53,000 police officers and staff across Great Britain.",
                            "keywords": "Airwave;,;longitudinal;,;cohort;,;police;,;Imperial;,;Population",
                            "publisher": {
                                "name": "Airwave",
                                "gatewayId": 58
                            },
                            "inPipeline": "Not available",
                            "shortTitle": "The Airwave Health Monitoring Study",
                            "datasetType": "Health and disease",
                            "description": "Please refer to the study website for more information about the study documents available (https://police-health.org.uk/study-data-documentation)",
                            "contactPoint": "airwave@imperial.ac.uk",
                            "datasetSubType": "Not applicable",
                            "populationSize": 53000,
                            "controlledKeywords": ""
                        },
                        "coverage": {
                            "pathway": "The Airwave Health Monitoring Study is a cohort study including c. 53,000 police officers and staff from Great Britain. Participants were recruited at baseline study between 2004-2015 and followed up through health screening visits, questionnaire and medical records.",
                            "spatial": "United Kingdom",
                            "followUp": "1 - 10 Years",
                            "typicalAgeRange": "18-74",
                            "datasetCompleteness": null
                        },
                        "required": {
                            "issued": "2024-10-08T11:31:50.611Z",
                            "version": "2.0.0",
                            "modified": "2024-10-08T11:31:50.611Z",
                            "gatewayId": 757,
                            "revisions": [
                                {
                                    "url": "https://web.prod.hdruk.cloud//dataset/757?version=1.0.0",
                                    "version": "1.0.0"
                                }
                            ],
                            "gatewayPid": "a0224326-efb0-450c-be89-bbf8ebd8de41"
                        },
                        "provenance": {
                            "origin": {
                                "source": "",
                                "purpose": "Study",
                                "imageContrast": "Not stated",
                                "collectionSituation": "Clinic"
                            },
                            "temporal": {
                                "endDate": "2015-03-30T23:00:00.000Z",
                                "timeLag": "Not applicable",
                                "startDate": "2004-01-01T00:00:00.000Z",
                                "accrualPeriodicity": "Static",
                                "distributionReleaseDate": "2018-07-31T23:00:00.000Z"
                            }
                        },
                        "observations": [
                            {
                                "observedNode": "Persons",
                                "measuredValue": 53000,
                                "observationDate": "2015-03-30T23:00:00.000Z",
                                "measuredProperty": "Questionnaire, clinical measurements, cognitive tests",
                                "disambiguatingDescription": null
                            }
                        ],
                        "accessibility": {
                            "usage": {
                                "resourceCreator": {
                                    "name": "The Airwave Health Monitoring Study"
                                },
                                "dataUseLimitation": "General research use",
                                "dataUseRequirement": "User-specific restriction"
                            },
                            "access": {
                                "accessRights": "https://police-health.org.uk/applying-access-resource",
                                "jurisdiction": "GB-ENG;,;GB-WLS;,;GB-SCT",
                                "accessService": "Using Dementia Platform UK's data portal, any bona fide researcher can apply to access data from the Airwave Health Monitoring Study by completing an online application form including: information about the applicant(s), project details, technical specification, data categories requested, and scientific context.",
                                "dataProcessor": null,
                                "dataController": "Imperial College London is the sole data controller for data collected from the Airwave Health Monitoring Study.",
                                "deliveryLeadTime": "2-6 months",
                                "accessRequestCost": "https://police-health.org.uk/applying-access-resource",
                                "accessServiceCategory": "Varies based on project"
                            },
                            "formatAndStandards": {
                                "formats": "text;,;tab-separted-values;,;csv",
                                "languages": "en",
                                "conformsTo": null,
                                "vocabularyEncodingSchemes": "ICD9;,;ICD10"
                            }
                        },
                        "structuralMetadata": [
                            {
                                "name": "Please refer to the study website",
                                "columns": [
                                    {
                                        "name": "NA",
                                        "values": null,
                                        "dataType": "NA",
                                        "sensitive": false,
                                        "description": "NA"
                                    }
                                ],
                                "description": "https://police-health.org.uk/study-data-documentation"
                            }
                        ],
                        "demographicFrequency": null,
                        "tissuesSampleCollection": [
                            {
                                "materialType": "Plasma"
                            },
                            {
                                "materialType": "Serum"
                            },
                            {
                                "materialType": "DNA"
                            },
                            {
                                "materialType": "Availability to be confirmed"
                            }
                        ]
                    },
                    "gwdmVersion": "2.0",
                    "original_metadata": {
                        "omics": null,
                        "issued": "2024-10-08T11:31:50.611Z",
                        "summary": {
                            "title": "The Airwave Health Monitoring Study",
                            "doiName": "10.1016/j.envres.2014.07.025",
                            "abstract": "The Airwave Health Monitoring Study (AHMS) is a long-term occupational observational cohort study and tissue bank following up the health of c. 53,000 police officers and staff across Great Britain.",
                            "keywords": [
                                "Airwave",
                                "longitudinal",
                                "cohort",
                                "police",
                                "Imperial",
                                "Population"
                            ],
                            "contactPoint": "airwave@imperial.ac.uk",
                            "dataCustodian": {
                                "logo": null,
                                "name": "Airwave",
                                "memberOf": null,
                                "identifier": 58,
                                "description": "Airwave",
                                "contactPoint": "airwave@imperial.ac.uk"
                            },
                            "populationSize": 53000,
                            "alternateIdentifiers": null
                        },
                        "version": "2.0.0",
                        "coverage": {
                            "pathway": "The Airwave Health Monitoring Study is a cohort study including c. 53,000 police officers and staff from Great Britain. Participants were recruited at baseline study between 2004-2015 and followed up through health screening visits, questionnaire and medical records.",
                            "spatial": "United Kingdom",
                            "followUp": "1 - 10 Years",
                            "materialType": [
                                "Plasma",
                                "Serum",
                                "DNA",
                                "Availability to be confirmed"
                            ],
                            "typicalAgeRangeMax": 74,
                            "typicalAgeRangeMin": 18,
                            "datasetCompleteness": null
                        },
                        "modified": "2024-10-08T11:31:50.611Z",
                        "revisions": [
                            {
                                "url": "https://web.prod.hdruk.cloud//dataset/757?version=1.0.0",
                                "version": "1.0.0"
                            }
                        ],
                        "identifier": "a0224326-efb0-450c-be89-bbf8ebd8de41",
                        "provenance": {
                            "origin": {
                                "source": [],
                                "purpose": [
                                    "Study"
                                ],
                                "datasetType": [
                                    {
                                        "name": "Health and disease",
                                        "subTypes": [
                                            "Cardiovascular",
                                            "Mental health",
                                            "Maternity and neonatology"
                                        ]
                                    },
                                    {
                                        "name": "Registry",
                                        "subTypes": [
                                            "Births and deaths"
                                        ]
                                    }
                                 ],
                                "imageContrast": "Not stated",
                               
                                "collectionSource": [
                                    "Clinic"
                                ]
                            },
                            "temporal": {
                                "endDate": "2015-03-30T23:00:00.000Z",
                                "timeLag": "Not applicable",
                                "startDate": "2004-01-01T00:00:00.000Z",
                                "publishingFrequency": "Static",
                                "distributionReleaseDate": "2018-07-31T23:00:00.000Z"
                            }
                        },
                        "observations": [
                            {
                                "observedNode": "Persons",
                                "measuredValue": 53000,
                                "observationDate": "2015-03-30T23:00:00.000Z",
                                "measuredProperty": "Questionnaire, clinical measurements, cognitive tests",
                                "disambiguatingDescription": null
                            }
                        ],
                        "accessibility": {
                            "usage": {
                                "resourceCreator": "The Airwave Health Monitoring Study",
                                "dataUseLimitation": [
                                    "General research use"
                                ],
                                "dataUseRequirements": [
                                    "User-specific restriction"
                                ]
                            },
                            "access": {
                                "accessRights": "https://police-health.org.uk/applying-access-resource",
                                "jurisdiction": [
                                    "GB-ENG",
                                    "GB-WLS",
                                    "GB-SCT"
                                ],
                                "accessService": "Using Dementia Platform UK's data portal, any bona fide researcher can apply to access data from the Airwave Health Monitoring Study by completing an online application form including: information about the applicant(s), project details, technical specification, data categories requested, and scientific context.",
                                "dataProcessor": null,
                                "dataController": "Imperial College London is the sole data controller for data collected from the Airwave Health Monitoring Study.",
                                "deliveryLeadTime": "2-6 months",
                                "accessRequestCost": "https://police-health.org.uk/applying-access-resource",
                                "accessServiceCategory": "Varies based on project"
                            },
                            "formatAndStandards": {
                                "format": [
                                    "text",
                                    "tab-separted-values",
                                    "csv"
                                ],
                                "language": [
                                    "en"
                                ],
                                "conformsTo": [],
                                "vocabularyEncodingScheme": [
                                    "ICD9",
                                    "ICD10"
                                ]
                            }
                        },
                        "documentation": {
                            "inPipeline": "Not available",
                            "description": "Please refer to the study website for more information about the study documents available (https://police-health.org.uk/study-data-documentation)",
                            "associatedMedia": "https://police-health.org.uk/study-data-documentation"
                        },
                        "structuralMetadata": {
                            "tables": [
                                {
                                    "name": "Please refer to the study website",
                                    "columns": [
                                        {
                                            "name": "NA",
                                            "values": null,
                                            "dataType": "NA",
                                            "sensitive": false,
                                            "description": "NA"
                                        }
                                    ],
                                    "description": "https://police-health.org.uk/study-data-documentation"
                                }
                            ]
                        },
                        "enrichmentAndLinkage": {
                            "tools": [
                                "http://www.google.com",
                                "https://github.com/HDRUK/papers"
                            ],
                            "investigations": [],
                            "publicationAboutDataset": [],
                            "publicationUsingDataset": []
                        }
                    }
                },
                "version": 1,
                "provider_team_id": null,
                "application_type": null,
                "short_title": "The Airwave Health Monitoring Study",
                "linked_dataset_versions": []
            }
        ],
        "team": {
            "id": 58,
            "pid": "6e9df769-d1fb-4aaf-8072-b70de5e4331a",
            "created_at": "2024-10-08T11:18:35.000000Z",
            "updated_at": "2025-03-24T14:48:00.000000Z",
            "deleted_at": null,
            "name": "Airwave",
            "enabled": true,
            "allows_messaging": false,
            "workflow_enabled": false,
            "access_requests_management": false,
            "uses_5_safes": false,
            "is_admin": false,
            "team_logo": null,
            "member_of": "OTHER",
            "contact_point": null,
            "application_form_updated_by": "Qresearch webapp",
            "application_form_updated_on": "0001-01-01 00:00:00",
            "mongo_object_id": "60d092bc99419879d0dfa485",
            "notification_status": false,
            "is_question_bank": true,
            "is_provider": false,
            "url": null,
            "introduction": null,
            "dar_modal_header": null,
            "dar_modal_content": null,
            "dar_modal_footer": null,
            "is_dar": false,
            "service": null
        }
    }



    const getMetadata = (isDraft: boolean) =>
        isDraft
            ? "versions[0].metadata.original_metadata"
            : "versions[0].metadata.metadata";

    const metadataLocation = getMetadata(isDraft);

    const latestMetadata = get(dataset, metadataLocation);

    const dataTypes =
        get(latestMetadata, "provenance.origin.datasetType") || [];

    const dataCustodianIdentifier = get(
        latestMetadata,
        "summary.dataCustodian.identifier"
    );

    const isNotTeamId = Number.isNaN(Number(dataCustodianIdentifier));
    const dataCustodianId = isNotTeamId
        ? await getTeamIdFromPid(cookieStore, dataCustodianIdentifier || "")
        : dataCustodianIdentifier;
    const { schema } = await getSchemaFromTraser(cookieStore, SCHEMA_NAME, SCHEMA_VERSION)

    const formJSON = await getFormHydration(
        cookieStore,
        SCHEMA_NAME,
        SCHEMA_VERSION,
        dataTypes,
        dataCustodianId
    );
 formJSON.schema_fields = tester.schema_fields
    console.log('here<<<', formJSON)

    interface DataSetTypeArrayType {
        name: string
        subTypes: string[]
    }

    const dataSetTypes:DataSetTypeArrayType[] = isDraft ? dataset.versions[0]?.metadata?.original_metadata?.provenance.origin?.datasetType : []

    const datasetTypesForForm = dataSetTypes.map(item => {
            return {
                'Dataset type': item.name,
                'Dataset subtypes': item.subTypes
            };
            })
    console.log(datasetTypesForForm, '<<<<<<datasetTypesForForm')

    formJSON.defaultValues={
        'Dataset type': extractNamesFromDataType(dataSetTypes),
        'Dataset Type Array':datasetTypesForForm,
        ...formJSON.defaultValues
    }

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.update"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <EditDataset
                    formJSON={formJSON}
                    teamId={Number(teamId)}
                    user={user}
                    defaultTeamId={Number(dataCustodianId)}
                     schemadefs={schema['$defs']}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
