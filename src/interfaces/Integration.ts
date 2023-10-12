
interface Integration {
    access_requests_management: boolean;
    allows_messaging: boolean;
    application_form_updated_by: string;
    application_form_updated_on: string;
    contact_point: string;
    created_at: string;
    deleted_at: string | null;
    enabled: boolean;
    federation: any[]; //not sure what this is
    id: number;
    is_admin: boolean;
    mdm_folder_id: string | null;
    member_of: number;
    name: string;
    updated_at: string;
    uses_5_safes: boolean;
    workflow_enabled: boolean;
  }
  
//if we need to omit anything 
/*interface IntegrationPayLoad extends Omit<Integration, "permissions"> {
    permissions: number[] | undefined;
}*/

export type { Integration }; //IntegrationPayLoad
