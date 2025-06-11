import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import {
    beforeYouBeginSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import {
    getDarSections,
    getDarAnswersUser,
    getDarApplicationUser,
    getDarReviewsUser,
    getUserFromCookie,
    updateDarApplicationUser,
    getAllDarSections,
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

    const userId = user.id.toString();

    let darApplication;
    try {
        darApplication = await getDarApplicationUser(
            cookieStore,
            applicationId,
            userId
        );
    } catch {
        redirect("/error/401");
    }

    let sections;
    let testSections;
    let userAnswers;
    let reviews;
    try {
        [sections, testSections, userAnswers, reviews] = await Promise.all([
            getDarSections(cookieStore),
            getAllDarSections(cookieStore),
            getDarAnswersUser(cookieStore, applicationId, userId),
            getDarReviewsUser(cookieStore, applicationId, userId),
        ]);
    } catch {
        redirect("/error/401");
    }
    console.log('<<<<<', testSections)
    console.log('<<<<<', sections)

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

    const suppress = cookieStore.get("dar-update-suppress");

    // If no approval status and submitted, set to draft
    if (
        !teamApplication?.approval_status &&
        teamApplication?.submission_status === DarApplicationStatus.SUBMITTED &&
        !suppress
    ) {
        await updateDarApplicationUser(applicationId, userId, {
            submission_status: DarApplicationStatus.DRAFT,
        });

        // Find the specific team and override its submission_status
        teamApplication = {
            ...darApplication?.teams?.find(team => team.team_id === +teamId),
            submission_status: DarApplicationStatus.DRAFT,
        } as DarTeamApplication;
    }

    if (!teamApplication && teamId) {
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
            isResearcher
            teamApplication={teamApplication}
            parentSections={parentSections}
            actionRequiredApplicant={actionRequiredApplicant}
            reviews={reviews}
        />
    );
}
