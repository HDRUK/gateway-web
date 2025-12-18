import { redirect } from "next/navigation";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import {
    beforeYouBeginSection,
    fileBasedTemplateSection,
    messageSection,
} from "@/config/forms/dataAccessApplication";
import {
    DarApplicationApprovalStatus,
    DarTemplateType,
} from "@/consts/dataAccess";
import { RouteName } from "@/consts/routeName";
import {
    getDarSections,
    getDarAnswersTeam,
    getDarReviewsTeam,
    getUser,
    getDarTeamApplication,
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
    params: Promise<{ applicationId: string; teamId: string }>;
}) {
    const isResearcher = false;

    const { applicationId, teamId } = await params;

    const user = await getUser();

    if (!user) {
        redirect(RouteName.ERROR_403);
    }

    let darApplication;
    try {
        darApplication = await getDarTeamApplication(applicationId, teamId);
    } catch {
        redirect("/error/401");
    }

    let sections;
    let userAnswers;
    let reviews;
    try {
        [sections, userAnswers, reviews] = await Promise.all([
            getDarSections(),
            getDarAnswersTeam(applicationId, teamId),
            getDarReviewsTeam(applicationId, teamId),
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

    if (darApplication.application_type === DarTemplateType.DOCUMENT) {
        formattedSections = [
            beforeYouBeginSection,
            fileBasedTemplateSection,
            messageSection,
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
            ...sections,
            messageSection,
        ];

        parentSections =
            formattedSections?.filter(s => s.parent_section === null) || [];
    }

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
