import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    beforeYouBeginSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import {
    getDarAnswersUser,
    getDarApplicationUser,
    getDarReviewsUser,
    getDarSections,
    getUserFromCookie,
    updateDarApplicationUser,
} from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import notFound from "@/app/not-found";
import ApplicationSection from "./components/ApplicationSection";

export const metadata = metaData(
    {
        title: "DAR Application",
        description: "",
    },
    noFollowRobots
);

export default async function DarApplicationPage({
    params,
    searchParams,
}: {
    params: { applicationId: string };
    searchParams: { teamId: string };
}) {
    const { applicationId } = params;
    const { teamId } = searchParams;

    const cookieStore = cookies();
    const user = getUserFromCookie(cookieStore);

    if (!user) {
        redirect("/error/401");
    }

    const userId = user!.id.toString();

    let darApplication = await getDarApplicationUser(
        cookieStore,
        applicationId,
        userId
    );

    const [sections, userAnswers, reviews] = await Promise.all([
        getDarSections(cookieStore),
        getDarAnswersUser(cookieStore, applicationId, userId),
        getDarReviewsUser(cookieStore, applicationId, userId),
    ]);

    if (!darApplication || !sections) {
        return notFound();
    }

    // Format sections
    const formattedSections = [
        beforeYouBeginSection,
        ...(reviews?.length ? [...sections, messageSection] : sections),
    ];

    const parentSections =
        formattedSections?.filter(s => s.parent_section === null) || [];

    let sectionId = 0;

    // Perform actions to application
    let teamApplication = darApplication.teams?.find(
        team => team.team_id === +teamId
    );

    // If no approval status and submitted, set to draft
    if (
        !teamApplication?.approval_status &&
        teamApplication?.submission_status === DarApplicationStatus.SUBMITTED
    ) {
        await updateDarApplicationUser(cookieStore, applicationId, userId, {
            submission_status: DarApplicationStatus.DRAFT,
        });

        // Refetch application
        darApplication = await getDarApplicationUser(
            cookieStore,
            applicationId,
            userId
        );

        teamApplication = darApplication?.teams?.find(
            team => team.team_id === +teamId
        );
    }

    if (!teamApplication) {
        return notFound();
    }

    const reviewComments = !!reviews?.length && reviews[0].comments;

    const actionRequiredApplicant =
        reviewComments && !reviewComments[reviewComments.length - 1].user_id;

    // If applicant action required, jump to messages section
    if (
        actionRequiredApplicant !== undefined &&
        reviews?.length &&
        teamApplication?.approval_status ===
            DarApplicationApprovalStatus.FEEDBACK &&
        actionRequiredApplicant
    ) {
        sectionId = messageSection.id;
    }

    return (
        <ApplicationSection
            teamId={teamId}
            userId={userId}
            applicationId={applicationId}
            data={darApplication}
            userAnswers={userAnswers}
            sections={formattedSections}
            initialSectionId={sectionId}
            isResearcher={true}
            teamApplication={teamApplication}
            parentSections={parentSections}
        />
    );
}
