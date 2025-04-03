import { cookies } from "next/headers";
import {
    beforeYouBeginSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import { DarApplicationApprovalStatus } from "@/consts/dataAccess";
import {
    getDarAnswersTeam,
    getDarReviewsTeam,
    getDarSections,
    getDarTeamApplication,
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

    let darApplication = await getDarTeamApplication(
        cookieStore,
        applicationId,
        teamId
    );

    const [sections, userAnswers, reviews] = await Promise.all([
        getDarSections(cookieStore),
        getDarAnswersTeam(cookieStore, applicationId, teamId),
        getDarReviewsTeam(cookieStore, applicationId, teamId),
    ]);

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

    // If no approval status, set to feedback
    if (!teamApplication?.approval_status) {
        await updateDarApplicationTeam(cookieStore, applicationId, teamId, {
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
        />
    );
}
