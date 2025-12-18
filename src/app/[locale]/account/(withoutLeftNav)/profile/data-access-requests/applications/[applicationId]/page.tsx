import { redirect } from "next/navigation";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import {
    beforeYouBeginSection,
    fileBasedTemplateSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import { DarApplicationApprovalStatus } from "@/consts/dataAccess";
import {
    getDarAnswersUser,
    getDarApplicationUser,
    getDarReviewsUser,
    getUserFromCookie,
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
    params: Promise<{ applicationId: string }>;
    searchParams: Promise<{ teamId: string }>;
}) {
    const { applicationId } = await params;
    const { teamId } = await searchParams;

    const user = await getUserFromCookie();

    if (!user) {
        redirect("/error/401");
    }

    const userId = user.id.toString();

    let darApplication;
    try {
        darApplication = await getDarApplicationUser(applicationId, userId);
    } catch {
        redirect("/error/401");
    }

    let sections;
    let userAnswers;
    let reviews;
    try {
        [sections, userAnswers, reviews] = await Promise.all([
            getAllDarSections(),
            getDarAnswersUser(applicationId, userId),
            getDarReviewsUser(applicationId, userId),
        ]);
    } catch {
        redirect("/error/401");
    }

    if (!darApplication || !sections) {
        return notFound();
    }

    // Format sections
    let formattedSections: QuestionBankSection[] = [];
    let parentSections: QuestionBankSection[];

    if (darApplication.application_type === "DOCUMENT") {
        formattedSections = [
            beforeYouBeginSection,
            fileBasedTemplateSection,
            ...(reviews?.length ? [messageSection] : []),
        ];

        parentSections = [
            beforeYouBeginSection,
            {
                id: 1,
                created_at: "",
                updated_at: "",
                deleted_at: null,
                name: "File-based Template",
                description: "",
                parent_section: null,
                order: 1,
            },
            messageSection,
        ];
    } else {
        formattedSections = [
            beforeYouBeginSection,
            ...(reviews?.length ? [...sections, messageSection] : sections),
        ];

        parentSections =
            formattedSections?.filter(s => s.parent_section === null) || [];
    }

    let sectionId = 0;

    // Perform actions to application
    let teamApplication = darApplication.teams?.find(
        team => team.team_id === +teamId
    );

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
