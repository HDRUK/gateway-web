import Box from "@/components/Box";
import ExpandList from "@/components/ExpandList/ExpandList";
import Typography from "@/components/Typography";

const EmailNotificationDescriptions = () => {
    const notificationDescriptions = [
        {
            role: "Team admins",
            listItems: [
                "New publisher team set up",
                "Automated metadata onboarding (If applicable to team)",
            ],
        },
        {
            role: "Data access request managers",
            listItems: [
                "DAR decision, workflow updates, form submission",
                "DAR approval/rejection",
                "DUR upload (manual onboarding only)",
                "Automated metadata onboarding (If applicable to team)",
            ],
        },
        {
            role: "Metadata managers",
            listItems: [
                "Automated metadata onboarding (If applicable to team)",
                "Date set live and archive (manual onboarding only)",
            ],
        },
        {
            role: "Data access request reviewers",
            listItems: ["DAR workflow (As required)"],
        },
        {
            role: "Metadata editors",
            listItems: ["Date set live and archive (manual onboarding only)"],
        },
        {
            role: "Developers",
            listItems: [
                "Automated metadata onboarding (If applicable to team)",
            ],
        },
    ];

    return (
        <Box sx={{ p: 0, mb: 5 }}>
            {notificationDescriptions.map(description => (
                <ExpandList
                    key={description.role}
                    showLessButton
                    {...description}
                    heading={
                        <>
                            <Typography fontWeight="bold" component="span">
                                {description.role}
                            </Typography>{" "}
                            receive notifications for;
                        </>
                    }
                />
            ))}
        </Box>
    );
};

export default EmailNotificationDescriptions;
