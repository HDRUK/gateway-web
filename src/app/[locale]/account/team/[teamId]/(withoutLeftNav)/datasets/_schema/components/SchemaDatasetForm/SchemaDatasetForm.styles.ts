import { styled } from "@mui/material/styles";
import Link from "@/components/Link";
import Paper from "@/components/Paper";

export const PageContainer = styled("div")(({ theme }) => ({
    marginTop: theme.spacing(1.75),
}));

export const ShellGrid = styled("div")(({ theme }) => ({
    display: "grid",
    gap: theme.spacing(1),
}));

export const IntroPaper = styled(Paper)(({ theme }) => ({
    flex: 2,
    marginTop: theme.spacing(1.25),
    marginRight: theme.spacing(1.25),
    padding: theme.spacing(2),
}));

export const BackLink = styled(Link)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
}));

export const FormRow = styled("div")({
    display: "flex",
    flexDirection: "row",
});

export const LegendColumn = styled("div")(({ theme }) => ({
    flex: "0 0 auto",
    width: theme.spacing(35),
    boxSizing: "border-box",
    padding: theme.spacing(1),
}));

export const MainColumn = styled("div")({
    flex: 2,
});

export const FormPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(1.25),
    padding: theme.spacing(2),
}));

export const GuidanceColumn = styled("div")(({ theme }) => ({
    position: "sticky",
    top: theme.spacing(4),
    flex: 1,
    alignSelf: "flex-start",
    overflow: "auto",
}));

export const GuidancePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1.25),
    wordBreak: "break-word",
    minHeight: "20vh",
}));

export const FooterRow = styled("div")(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(1),
    margin: theme.spacing(2),
}));

export const FooterItem = styled("div")({
    display: "flex",
    flex: 1,
    justifyContent: "center",
});

export const WelcomeHeader = styled("div")({});

export const AsideSlot = styled("div")({
    display: "contents",
});

export const SubmissionColumn = styled("div")({
    flex: 3,
});

export const IntroFields = styled("div")(({ theme }) => ({
    padding: theme.spacing(2),
}));
