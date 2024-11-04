import { cookies } from "next/headers";
import BoxContainer from "@/components/BoxContainer";
import ProtectedAccountRoute from "@/components/ProtectedAccountRoute";
import { getFormHydration, getTeam, getUser } from "@/utils/api";
import { getPermissions } from "@/utils/permissions";
import { getTeamUser } from "@/utils/user";
import CreateDataset from "../components/CreateDataset";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account - Dataset Create",
    description: "",
};

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "2.2.1";

export default async function CreateDatasetPage({
    params,
}: {
    params: { teamId: string };
}) {
    const { teamId } = params;
    const cookieStore = cookies();
    const user = await getUser(cookieStore);
    const team = await getTeam(cookieStore, teamId);
    const teamUser = getTeamUser(team?.users, user?.id);
    const permissions = getPermissions(user.roles, teamUser?.roles);

    const formJSON = await getFormHydration(
        cookieStore,
        SCHEMA_NAME,
        SCHEMA_VERSION,
        [],
        teamId
    );

    // - Forcing the removal of 'contact point'
    // - we have "Contact point" and 'contact point' returned
    // - bad idea to use title as names! should be a key (e.g. location)
    /*
         {
                "title": "contact point",
                "is_array_form": false,
                "description": "Organisation contact point(s) which will be used for receiving queries from HDR, and enquiries and data access requests from Researchers.  If a contact point is not provided this will default to the contact point for the team submitting the metadata.",
                "location": "summary.dataCustodian.contactPoint",
                "guidance": "",
                "field": {
                    "component": "TextField",
                    "name": "contact point",
                    "placeholder": "test@test.co.uk",
                    "label": "Organisation contact point(s) which will be used for receiving queries from HDR, and enquiries and data access requests from Researchers.  If a contact point is not provided this will default to the contact point for the team submitting the metadata.",
                    "required": true,
                    "hidden": true
                }
        ....

         {
                "title": "Contact point",
                "is_array_form": false,
                "description": "Please provide a valid email address that can be used to coordinate data access requests.",
                "location": "summary.contactPoint",
                */
    // - This was causing all sorts of issues with the form!
    // - the 2nd one is 'hidden' and goes nowhere
    // - only thing it does is cause hidden validation errors

    // For now, let's remove the "contact point"
    // - why? - because it's a hidden field and replaced in the backend anyway
    const fixedFormJson = {
        schema_fields: formJSON.schema_fields.filter(
            t => t.title !== "contact point"
        ),
        validation: formJSON.validation.filter(
            t => t.title !== "contact point"
        ),
        defaultValues: formJSON.defaultValues,
    };

    return (
        <ProtectedAccountRoute
            permissions={permissions}
            pagePermissions={["datasets.create"]}>
            <BoxContainer sx={{ mt: "14px" }}>
                <CreateDataset
                    formJSON={fixedFormJson}
                    teamId={Number(teamId)}
                    user={user}
                />
            </BoxContainer>
        </ProtectedAccountRoute>
    );
}
