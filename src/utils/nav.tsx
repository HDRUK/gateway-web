import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Role } from "@/interfaces/Role";
import { LeftNavItem } from "@/interfaces/Ui";
import {
    ControlPointIcon,
    ToolIcon,
    HelpOutlineOutlinedIcon,
    DataUseIcon,
    DatabaseIcon, // CloudUploadIcon,
    BookmarkBorderIcon,
    BookmarkIcon,
    BookmarksOutlinedIcon,
    PublicationIcon,
    PersonOutlineOutlinedIcon,
    CohortIcon,
    CloudUploadIcon,
    TeamMembersIcon,
    DarIcon,
} from "@/consts/icons";
import { ROLE_HDRUK_SUPERADMIN } from "@/consts/roles";
import { RouteName } from "@/consts/routeName";
import { setCohortRedirectCookie } from "@/app/actions/setCohortRedirectCookie";
import { getCohortAccessRedirect } from "./api";

const navIcon = (Icon: React.ElementType) => <Icon fontSize="inherit" />;

const getProfileNav = (
    permissions: {
        [key: string]: boolean;
    },
    roles: Role[],
    features: { [key: string]: boolean },
    cohortDiscoveryApproved: boolean = false
): LeftNavItem[] => {
    const { isCohortDiscoveryServiceEnabled, isRQuestEnabled } = features;

    return [
        {
            icon: navIcon(PersonOutlineOutlinedIcon),
            label: "Your Profile",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}`,
        },
        {
            icon: navIcon(BookmarkBorderIcon),
            label: "Library",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.LIBRARY}`,
        },
        {
            icon: navIcon(BookmarkIcon),
            label: "Saved searches",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.SAVED_SEARCHES}`,
        },
        ...(roles?.some(role => role.name === ROLE_HDRUK_SUPERADMIN)
            ? [
                  {
                      icon: navIcon(DataUseIcon),
                      label: "Feature Flags",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.FEATURES}`,
                  },
              ]
            : []),
        ...(permissions["custodians.read"]
            ? [
                  {
                      icon: navIcon(ControlPointIcon),
                      label: "Teams",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TEAMS}`,
                  },
              ]
            : []),
        ...(permissions["cohort.read"] &&
        isRQuestEnabled &&
        !isCohortDiscoveryServiceEnabled
            ? [
                  {
                      icon: navIcon(CohortIcon),
                      label: "Cohort Discovery Admin",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN}`,
                  },
              ]
            : []),
        {
            icon: navIcon(CohortIcon),
            label: "Cohort Discovery",
            subItems: [
                {
                    label: "My access request",
                    href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}`,
                },

                ...(permissions["cohort.read"] &&
                isCohortDiscoveryServiceEnabled
                    ? [
                          {
                              label: "User Admin",
                              href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN}`,
                          },
                          /*...(isCohortDiscoveryServiceEnabled &&
                          cohortDiscoveryApproved
                              ? [
                                    {
                                        label: "Collection & Workgroup Admin",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN_COLLECTIONS}`,
                                    },
                                    {
                                        label: "Discover Cohorts",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/cohort-discovery-builder`,
                                    },
                                ]
                              : []),*/
                      ]
                    : []),
                {
                    label: "About this service",
                    href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ABOUT}`,
                },
            ],
        },
        {
            icon: navIcon(DarIcon),
            label: "Data Access Requests",
            subItems: [
                {
                    label: "My Data Access Requests",
                    href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`,
                },
                ...(permissions["question-bank.update"]
                    ? [
                          {
                              label: "Question Bank",
                              href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}`,
                          },
                      ]
                    : []),
            ],
        },

        {
            icon: navIcon(ToolIcon),
            label: "Analysis Scripts & Software",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}`,
        },
        {
            icon: navIcon(PublicationIcon),
            label: "Publications",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}`,
        },
        {
            icon: navIcon(BookmarksOutlinedIcon),
            label: "Collections",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COLLECTIONS}`,
        },
    ];
};

const getTeamNav = (
    permissions: {
        [key: string]: boolean;
    },
    teamId: string | undefined,
    features: { [key: string]: boolean },
    cohortDiscoveryApproved: boolean = false
): LeftNavItem[] => {
    const { isWidgetsEnabled, isCohortDiscoveryServiceEnabled } = features;

    return [
        ...(permissions["roles.read"]
            ? [
                  {
                      icon: navIcon(TeamMembersIcon),
                      label: "Team members",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TEAM_MANAGEMENT}`,
                  },
              ]
            : []),
        ...([
            permissions["applications.read"],
            permissions["integrations.metadata"],
            permissions["integrations.dar"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: navIcon(CloudUploadIcon),
                      label: "Integrations",
                      subItems: [
                          ...(permissions["applications.read"]
                              ? [
                                    {
                                        label: "Custom Integrations",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.API_MANAGEMENT}`,
                                    },
                                ]
                              : []),
                          ...([
                              permissions["integrations.metadata"],
                              permissions["integrations.dar"],
                          ].some(isTrue => isTrue)
                              ? [
                                    {
                                        label: "Predefined Integrations",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}`,
                                    },
                                ]
                              : []),
                          ...(permissions["widgets.read"] && isWidgetsEnabled
                              ? [
                                    {
                                        label: "Widgets",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.WIDGETS}`,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        ...(permissions["datasets.read"]
            ? [
                  {
                      icon: navIcon(DatabaseIcon),
                      label: "Datasets",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`,
                  },
              ]
            : []),
        ...([
            permissions["data-access-template.read"],
            permissions["data-access-applications.provider.read"],
            permissions["data-access-applications.review.read"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: navIcon(DarIcon),
                      label: "Data Access Requests",
                      subItems: [
                          ...(permissions["data-access-template.read"]
                              ? [
                                    {
                                        label: "Manage Templates",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`,
                                    },
                                ]
                              : []),
                          ...([
                              permissions[
                                  "data-access-applications.provider.read"
                              ],
                              permissions[
                                  "data-access-applications.review.read"
                              ],
                          ].some(isTrue => isTrue)
                              ? [
                                    {
                                        label: "Applications",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        ...(permissions["papers.read"]
            ? [
                  {
                      icon: navIcon(PublicationIcon),
                      label: "Publications",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`,
                  },
              ]
            : []),
        ...(permissions["tools.read"]
            ? [
                  {
                      icon: navIcon(ToolIcon),
                      label: "Analysis Scripts & Software",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`,
                  },
              ]
            : []),
        ...(permissions["collections.read"]
            ? [
                  {
                      icon: navIcon(BookmarksOutlinedIcon),
                      label: "Collections",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`,
                  },
              ]
            : []),
        ...(permissions["dur.update"]
            ? [
                  {
                      icon: navIcon(DataUseIcon),
                      label: "Data Uses",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}`,
                  },
              ]
            : []),
        ...(isCohortDiscoveryServiceEnabled &&
        cohortDiscoveryApproved &&
        [
            permissions["cohort.team.read"],
            permissions["cohort.team.create"],
        ].every(isTrue => isTrue)
            ? [
                  {
                      icon: <PersonSearchIcon />,
                      label: "Cohort Discovery",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COHORT_DISCOVERY}`,
                  },
              ]
            : []),
        {
            icon: navIcon(HelpOutlineOutlinedIcon),
            label: "Help",
            href: RouteName.DATA_CUSTODIAN_SUPPORT,
        },
    ];
};

export { getProfileNav, getTeamNav };
