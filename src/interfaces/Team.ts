interface Team {
    id: number,
    name: string,
    enabled: boolean,
    allows_messaging: boolean,
    workflow_enabled: boolean,
    access_requests_management: boolean,
    uses_5_safes: boolean,
    is_admin: boolean,
    member_of: number,
    contact_point: string,
    application_form_updated_by: string,
    application_form_updated_on: string,
}

export type { Team };
