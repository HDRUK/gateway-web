import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import {
    beforeYouBeginSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import { DarApplicationApprovalStatus } from "@/consts/dataAccess";
import { RouteName } from "@/consts/routeName";
import {
    getDarAnswersTeam,
    getDarReviewsTeam,
    getDarSections,
    getDarTeamApplication,
    getUser,
    updateDarApplicationTeam,
} from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import ApplicationSection from "@/app/[locale]/account/(withoutLeftNav)/profile/data-access-requests/applications/[applicationId]/components/ApplicationSection";
import notFound from "@/app/not-found";

export const metadata = metaData(
    {
        title: "DAR Application",
        description: "",
    },
    noFollowRobots
);

export default async function DarApplicationPage({
    params,
}: {
    params: { applicationId: string; teamId: string };
}) {
    const isResearcher = false;

    const { applicationId, teamId } = params;

    const cookieStore = cookies();
    const user = await getUser(cookieStore);

    if (!user) {
        redirect(RouteName.ERROR_403);
    }

    let darApplication;
    try {
        darApplication = await getDarTeamApplication(
            cookieStore,
            applicationId,
            teamId
        );
    } catch {
        redirect("/error/401");
    }

    let sections;
    let userAnswers;
    let reviews;
    try {
        [sections, userAnswers, reviews] = await Promise.all([
            getDarSections(cookieStore),
            getDarAnswersTeam(cookieStore, applicationId, teamId),
            getDarReviewsTeam(cookieStore, applicationId, teamId),
        ]);
    } catch {
        redirect("/error/401");
    }

    if (!darApplication || !sections) {
        return notFound();
    }

    // Format sections
    const formattedSections = [
        beforeYouBeginSection,
        ...sections,
        messageSection,
    ];

    const parentSections =
        formattedSections?.filter(s => s.parent_section === null) || [];

    let sectionId = 0;

    // Perform actions to application
    let teamApplication = darApplication.teams?.find(
        team => team.team_id === +teamId
    );

    const reviewComments = !!reviews?.length && reviews[0].comments;

    // If applicant action required, jump to messages section
    const actionRequiredApplicant =
        reviewComments && !reviewComments[reviewComments.length - 1].user_id;

    // If custodian action required, jump to messages section
    if (
        reviews?.length &&
        teamApplication?.approval_status ===
            DarApplicationApprovalStatus.FEEDBACK &&
        !actionRequiredApplicant
    ) {
        sectionId = messageSection.id;
    }

    const suppress = cookieStore.get("dar-update-suppress");

    // If no approval status, set to feedback
    if (!teamApplication?.approval_status && !suppress) {
        await updateDarApplicationTeam(applicationId, teamId, {
            approval_status: DarApplicationApprovalStatus.FEEDBACK,
        });

        // Refetch application
        darApplication = await getDarTeamApplication(
            cookieStore,
            applicationId,
            teamId
        );

        teamApplication = darApplication?.teams?.find(
            team => team.team_id === +teamId
        );
    }

    if (!teamApplication) {
        return notFound();
    }

    return (
        <ProtectedAccountRoute loggedInOnly>
            <ApplicationSection
                teamId={teamId}
                applicationId={applicationId}
                data={darApplication}
                userAnswers={userAnswers}
                parentSections={parentSections}
                sections={formattedSections}
                initialSectionId={sectionId}
                reviews={reviews}
                isResearcher={isResearcher}
                teamApplication={teamApplication}
                actionRequiredApplicant={actionRequiredApplicant}
            />
        </ProtectedAccountRoute>
    );
}
