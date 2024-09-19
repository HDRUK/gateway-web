import SearchIcon from "@mui/icons-material/Search";
import { LeftNavItem } from "@/interfaces/Ui";
import {
    DescriptionOutlinedIcon,
    FolderSharedOutlinedIcon,
    GroupsIcon,
    GroupsOutlinedIcon,
    HandymanOutlinedIcon,
    HelpOutlineOutlinedIcon,
    QuestionAnswerIcon,
    SchemaOutlinedIcon,
    SettingsOutlinedIcon,
    StorageOutlinedIcon,
    CloudUploadIcon,
    ArticleIcon,
    BookmarkBorderIcon,
    BookmarksIcon,
    StickyNote2OutlinedIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";

const getProfileNav = (permissions: {
    [key: string]: boolean;
}): LeftNavItem[] => {
    return [
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}`,
        },
        {
            icon: <HandymanOutlinedIcon />,
            label: "Analysis Scripts & Software",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}`,
        },
        {
            icon: <StickyNote2OutlinedIcon />,
            label: "Publications",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.PUBLICATIONS}`,
        },
        //TODO: do these go under a "Dashboard" parent?
        {
            icon: <SearchIcon />,
            label: "Saved searches",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.SAVED_SEARCHES}`,
        },
        {
            icon: <BookmarkBorderIcon />,
            label: "Library",
            href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.LIBRARY}`,
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
                      label: "DAR Admin",
                      subItems: [
                          ...(permissions["dar-config.update"]
                              ? [
                                    {
                                        label: "Question Bank Management",
                                        href: `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}`,
                                    },
                                ]
                              : []),
                      ],
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
    console.log(permissions);
    return [
        {
            icon: <SettingsOutlinedIcon />,
            label: "Team Management",
            href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TEAM_MANAGEMENT}`,
        },
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
                      icon: <StorageOutlinedIcon />,
                      label: "Datasets",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`,
                  },
              ]
            : []),
        ...(permissions["collections.read"]
            ? [
                  {
                      icon: <BookmarksIcon />,
                      label: "Collections",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`,
                  },
              ]
            : []),
        ...(permissions["tools.read"]
            ? [
                  {
                      icon: <HandymanOutlinedIcon />,
                      label: "Analysis Scripts & Software",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`,
                  },
              ]
            : []),
        ...(permissions["papers.read"]
            ? [
                  {
                      icon: <ArticleIcon />,
                      label: "Publications",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`,
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
                      icon: <GroupsOutlinedIcon />,
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
                      icon: <ArticleIcon />,
                      label: "Publications",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.PUBLICATIONS}`,
                  },
              ]
            : []),
        ...(permissions["tools.read"]
            ? [
                  {
                      icon: <HandymanOutlinedIcon />,
                      label: "Analysis Scripts & Software",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`,
                  },
              ]
            : []),
        ...(permissions["collections.read"]
            ? [
                  {
                      icon: <BookmarksIcon />,
                      label: "Collections",
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.COLLECTIONS}`,
                  },
              ]
            : []),
        ...([
            permissions["dur.read"],
            permissions["dur.write"],
            permissions["dur.update"],
            permissions["dur.delete"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: <SchemaOutlinedIcon />,
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
