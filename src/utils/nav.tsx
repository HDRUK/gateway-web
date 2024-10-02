import { LeftNavItem } from "@/interfaces/Ui";
import {
    DescriptionOutlinedIcon,
    GroupsIcon,
    DescriptionIcon,
    ToolIcon,
    HelpOutlineOutlinedIcon,
    QuestionAnswerIcon,
    DataUseIcon,
    SettingsOutlinedIcon,
    DatabaseIcon,
    CloudUploadIcon,
    BookmarkBorderIcon,
    BookmarkIcon,
    BookmarksOutlinedIcon,
    PublicationIcon,
    PersonOutlineOutlinedIcon,
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
                      icon: <GroupsIcon />,
                      label: "Teams",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TEAMS}`,
                  },
              ]
            : []),
        // TODO: add Datasets
        ...(permissions["cohort.read"]
            ? [
                  {
                      icon: <DescriptionOutlinedIcon />,
                      label: "Cohort Discovery Admin",
                      href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN}`,
                  },
              ]
            : []),
        ...(permissions["dar-config.update"] // this will need fixing/updating
            ? [
                  {
                      icon: <QuestionAnswerIcon />,
                      label: "Data Access Requests",
                      subItems: [
                          ...(permissions["dar-config.update"]
                              ? [
                                    {
                                        label: "Question Bank",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}`,
                                    },
                                ]
                              : []),
                          // TODO add Applications for HDRUK DAR Admin
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
        // TODO: add Data Uses
    ];
};

const getTeamNav = (
    permissions: {
        [key: string]: boolean;
    },
    teamId: string | undefined
): LeftNavItem[] => {
    console.log(permissions);
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
            permissions["integrations.metadata"],
            permissions["integrations.dar"],
            permissions["applications.read"],
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
                      icon: <DatabaseIcon color="secondary" />,
                      label: "Datasets",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`,
                  },
              ]
            : []),
        ...([
            permissions["dar.read.assigned"],
            permissions["workflows.read"],
            permissions["dar-form.update"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: <DescriptionIcon />,
                      label: "Data Access Requests",
                      subItems: [
                          ...(permissions["dar-form.update"]
                              ? [
                                    {
                                        label: "Manage Templates",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.DAR_TEMPLATES}`,
                                    },
                                ]
                              : []),
                          ...(permissions["dar.read.assigned"]
                              ? [
                                    {
                                        label: "Applications",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.APPLICATIONS}`,
                                    },
                                ]
                              : []),
                          ...(permissions["workflows.read"]
                              ? [
                                    {
                                        label: "Workflows",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATA_ACCESS_REQUESTS}/${RouteName.WORKFLOWS}`,
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
        ...(permissions["dur.read"]
            ? [
                  {
                      icon: <DataUseIcon />,
                      label: "Data Uses",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/data-uses`,
                  },
              ]
            : []),
        {
            icon: <HelpOutlineOutlinedIcon />,
            label: "Help",
            href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.HELP}`,
        },
    ];
};

export { getProfileNav, getTeamNav };
