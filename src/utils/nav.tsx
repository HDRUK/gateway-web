import { LeftNavItem } from "@/interfaces/Ui";
import {
    ControlPointIcon,
    DescriptionIcon,
    ToolIcon,
    HelpOutlineOutlinedIcon,
    DataUseIcon,
    SettingsOutlinedIcon,
    DatabaseIcon, // CloudUploadIcon,
    BookmarkBorderIcon,
    BookmarkIcon,
    BookmarksOutlinedIcon,
    PublicationIcon,
    PersonOutlineOutlinedIcon,
    CohortIcon,
    CloudUploadIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const getProfileNav = (permissions: {
    [key: string]: boolean;
}): LeftNavItem[] => {
    return [
        {
            icon: <PersonOutlineOutlinedIcon />,
            label: "Your Profile",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}`,
        },
        {
            icon: <BookmarkBorderIcon />,
            label: "Library",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.LIBRARY}`,
        },
        {
            icon: <BookmarkIcon />,
            label: "Saved searches",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.SAVED_SEARCHES}`,
        },
        ...(permissions["custodians.read"]
            ? [
                  {
                      icon: <ControlPointIcon />,
                      label: "Teams",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TEAMS}`,
                  },
              ]
            : []),
        ...(permissions["cohort.read"]
            ? [
                  {
                      icon: <CohortIcon />,
                      label: "Cohort Discovery Admin",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN}`,
                  },
              ]
            : []),
        ...(permissions["question-bank.update"]
            ? [
                  {
                      icon: <DescriptionIcon />,
                      label: "Data Access Requests",
                      subItems: [
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
              ]
            : []),
        {
            icon: <ToolIcon />,
            label: "Analysis Scripts & Software",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}`,
        },
        {
            icon: <PublicationIcon />,
            label: "Publications",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}`,
        },
        {
            icon: <BookmarksOutlinedIcon />,
            label: "Collections",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COLLECTIONS}`,
        },
        ...(permissions["dur.update"]
            ? [
                  {
                      icon: <DataUseIcon />,
                      label: "Data Uses",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DATA_USES}`,
                  },
              ]
            : []),
    ];
};

const getTeamNav = (
    permissions: {
        [key: string]: boolean;
    },
    teamId: string | undefined
): LeftNavItem[] => {
    return [
        ...(permissions["roles.read"]
            ? [
                  {
                      icon: <SettingsOutlinedIcon />,
                      label: "Team Management",
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
                      icon: <CloudUploadIcon />,
                      label: "Integrations",
                      subItems: [
                          ...(permissions["applications.read"]
                              ? [
                                    {
                                        label: "Private apps",
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
                                        label: "Gateway apps",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.INTEGRATIONS}/${RouteName.INTEGRATION}`,
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
                      icon: <DatabaseIcon />,
                      label: "Datasets",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`,
                  },
              ]
            : []),
        // ...([
        //     permissions["data-access-template.read"],
        //     permissions["data-access-applications.provider.read"],
        //     permissions["data-access-applications.review.read"],
        // ].some(isTrue => isTrue)
        //     ? [
        //           {
        //               icon: <DescriptionIcon />,
        //               label: "Data Access Requests",
        //               subItems: [
        //                   ...(permissions["data-access-template.read"]
        //                       ? [
        //                             {
        //                                 label: "Manage Templates",
        //                                 href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`,
        //                             },
        //                         ]
        //                       : []),
        //                   ...([
        //                       permissions[
        //                           "data-access-applications.provider.read"
        //                       ],
        //                       permissions[
        //                           "data-access-applications.review.read"
        //                       ],
        //                   ].some(isTrue => isTrue)
        //                       ? [
        //                             {
        //                                 label: "Applications",
        //                                 href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`,
        //                             },
        //                         ]
        //                       : []),
        //               ],
        //           },
        //       ]
        //     : []),
        ...(permissions["papers.read"]
            ? [
                  {
                      icon: <PublicationIcon />,
                      label: "Publications",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`,
                  },
              ]
            : []),
        ...(permissions["tools.read"]
            ? [
                  {
                      icon: <ToolIcon />,
                      label: "Analysis Scripts & Software",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`,
                  },
              ]
            : []),
        ...(permissions["collections.read"]
            ? [
                  {
                      icon: <BookmarksOutlinedIcon />,
                      label: "Collections",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`,
                  },
              ]
            : []),
        ...(permissions["dur.update"]
            ? [
                  {
                      icon: <DataUseIcon />,
                      label: "Data Uses",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_USES}`,
                  },
              ]
            : []),
        {
            icon: <HelpOutlineOutlinedIcon />,
            label: "Help",
            href: `/${RouteName.SUPPORT}`,
        },
    ];
};

export { getProfileNav, getTeamNav };
