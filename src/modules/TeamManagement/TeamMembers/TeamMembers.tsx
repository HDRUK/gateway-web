import Box from "@/components/Box";
import Loading from "@/components/Loading";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Team } from "@/interfaces/Team";
import { TeamMemberRoles } from "@/interfaces/TeamMemberRoles";
import { User } from "@/interfaces/User";
import Checkbox from "@/components/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import HelpIcon from "@mui/icons-material/HelpOutline";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import theme from "@/config/theme";

const TeamMembers = () => {
    const router = useRouter();
    const { teamId } = router.query;
    const [popoverNumber, setPopoverNumber] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [furtherActionsAnchorEl, setFurtherActionsAnchorEl] =
        useState<HTMLButtonElement | null>(null);
    const [furtherActionsOpen, setFurtherActionsOpen] = useState(false);

    const handlePopoverClick = (
        event: MouseEvent<HTMLButtonElement>,
        id: number
    ) => {
        setAnchorEl(event.currentTarget);
        setPopoverNumber(id);
    };

    const handleFurtherActionsClick = (
        event: MouseEvent<HTMLButtonElement>
    ) => {
        setFurtherActionsAnchorEl(event.currentTarget);
        setFurtherActionsOpen(!furtherActionsOpen);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFurtherActionsClose = () => {
        setFurtherActionsOpen(!furtherActionsOpen);
    };

    const openPopover = Boolean(anchorEl);

    const { control } = useForm<TeamMemberRoles>({});

    const { data: teamUserList = [], isLoading: isTeamListLoading } = useGet<
        Team[]
    >(`${apis.teamsV1Url}/${teamId}`);

    if (isTeamListLoading) return <Loading />;

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="team members">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    sx={{ fontWeight: 700, display: "flex" }}>
                                    Team{" "}
                                    <HelpIcon
                                        id="team-help"
                                        color="primary"
                                        onClick={event =>
                                            handlePopoverClick(event, 1)
                                        }
                                    />
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    sx={{ fontWeight: 700, display: "flex" }}>
                                    Data Access Requests{" "}
                                    <HelpIcon
                                        id="dar-help"
                                        color="primary"
                                        onClick={event =>
                                            handlePopoverClick(event, 2)
                                        }
                                    />
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    sx={{ fontWeight: 700, display: "flex" }}>
                                    Metadata{" "}
                                    <HelpIcon
                                        id="metadata-help"
                                        color="primary"
                                        onClick={event =>
                                            handlePopoverClick(event, 3)
                                        }
                                    />
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={{ fontWeight: 700 }}>
                                    Further Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teamUserList.users.map((user: User) => {
                            // Intentionally always hide our internal super-user account
                            // from team lists
                            return user.id !== 1 ? (
                                <TableRow key={user.name}>
                                    <TableCell component="th" scope="row">
                                        {user.firstname} {user.lastname}
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            label="Admin"
                                            control={control}
                                            name="isTeamAdmin"
                                        />
                                        <Checkbox
                                            label="Developer"
                                            control={control}
                                            name="isTeamDeveloper"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            label="Manager"
                                            control={control}
                                            name="isDarManager"
                                        />
                                        <Checkbox
                                            label="Reviewer"
                                            control={control}
                                            name="isDarReviewer"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            label="Manager"
                                            control={control}
                                            name="isMetadataManager"
                                        />
                                        <Checkbox
                                            label="Editor"
                                            control={control}
                                            name="isMetadataEditor"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <MoreIcon
                                            sx={{
                                                color: theme.palette.primary.main,
                                            }}
                                            onClick={event =>
                                                handleFurtherActionsClick(event)
                                            }
                                        />
                                        <Menu
                                            id="remove-user-menu"
                                            anchorEl={furtherActionsAnchorEl}
                                            open={furtherActionsOpen}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                "aria-labelledby":
                                                    "remove-user-button",
                                            }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                }}>
                                                <DeleteIcon
                                                    sx={{
                                                        marginTop: 1.5,
                                                        color: theme.palette.primary.main,
                                                    }}
                                                />
                                                <MenuItem
                                                    onClick={
                                                        handleFurtherActionsClose
                                                    }
                                                    sx={{
                                                        color: theme.palette.primary.main,
                                                    }}>
                                                    Remove user
                                                </MenuItem>
                                            </Box>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ""
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Popover
                id="popover"
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                PaperProps={{
                    style: {
                        width: "500px",
                        color: "white",
                        backgroundColor: "black",
                    },
                }}>
                {/* Team blurb */}
                {popoverNumber === 1 && (
                    <ul>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Admins
                            </Typography>{" "}
                            can; manage the existing members of your team, add
                            new members, manage the teams notifications
                            preferences like adding and editing the team email
                            address.
                        </li>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Developers
                            </Typography>{" "}
                            can; develop things, this is placeholder text, copy
                            to be added.
                        </li>
                    </ul>
                )}

                {/* Data Access Requests blurb */}
                {popoverNumber === 2 && (
                    <ul>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Managers
                            </Typography>{" "}
                            can; manage members, create and assign workflows and
                            make the final decision on data access request
                            applications.
                        </li>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Reviewers
                            </Typography>{" "}
                            can review applications that are assigned to them.
                        </li>
                    </ul>
                )}

                {/* Metadata blurb */}
                {popoverNumber === 3 && (
                    <ul>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Managers
                            </Typography>{" "}
                            can; manage members, add, edit and archive metadata.
                        </li>
                        <li>
                            <Typography
                                sx={{ fontWeight: 700, display: "inline" }}>
                                Metadata editors
                            </Typography>{" "}
                            can add, edit and archive metadata.
                        </li>
                    </ul>
                )}
            </Popover>
        </>
    );
};

export default TeamMembers;
