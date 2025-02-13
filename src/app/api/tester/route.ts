import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const data = {
        total: 1,
        items: [
            {
                persistentId: "242c84be-a866-ac0c-0000-532000001bbd",
                name: "A Really Nice Test",
                type: "dataset",
                description:
                    "Sometimes, on occasion, I have been known to go and partake in a sunday roast with pudding, but never custard.",
                version: "1.0.13",
                self: "https://nhse-ics-kms-uat5-ui.metadata.works/api/federation/dataset/7101",
                source: "",
                "@schema":
                    "https://raw.githubusercontent.com/HDRUK/schemata-2/master/hdr_schemata/models/HDRUK/2.1.0/schema.json",
                issued: "2024-03-09T23:22:05+00:00",
                modified: "2024-07-03T09:54:34+00:00",
            },
            {
                persistentId: "242c84be-a866-ac0c-0000-532000001bbc",
                name: "Another Really Nice Test",
                type: "dataset",
                description:
                    "The reason for the lack of custard is i can never get the amount correct...",
                version: "1.0.1",
                self: "https://nhse-ics-kms-uat5-ui.metadata.works/api/federation/dataset/7101",
                source: "",
                "@schema":
                    "https://raw.githubusercontent.com/HDRUK/schemata-2/master/hdr_schemata/models/HDRUK/2.1.0/schema.json",
                issued: "2024-03-09T23:22:05+00:00",
                modified: "2024-07-03T09:54:34+00:00",
            },




            
            // {
            //     persistentId: "242c84be-a866-ac0c-0000-000000001bbe",
            //     name: "Kent Integrated Dataset - GP Event",
            //     description:
            //         "Primary Care Event information, recording the intereactions that patients with medical staff at GP practices and some read-coded numeric data",
            //     version: "1.0.0",
            //     self: "https://nhse-ics-kms-uat5-ui.metadata.works/api/federation/dataset/7102",
            //     source: "",
            //     "@schema":
            //         "https://raw.githubusercontent.com/HDRUK/schemata-2/master/hdr_schemata/models/HDRUK/2.1.0/schema.json",
            //     issued: "2024-03-09T23:22:07+00:00",
            //     modified: "2024-07-03T09:55:18+00:00",
            // },
            // {
            //     persistentId: "242c84be-a866-ac0c-0000-000000002564",
            //     name: "Sample Dataset",
            //     version: "1.0.8",
            //     self: "https://nhse-ics-kms-uat5-ui.metadata.works/api/federation/dataset/9572",
            //     source: "",
            //     "@schema":
            //         "https://raw.githubusercontent.com/HDRUK/schemata-2/master/hdr_schemata/models/HDRUK/2.1.0/schema.json",
            //     issued: "2024-01-29T17:01:20+00:00",
            //     modified: "2024-11-26T09:37:22+00:00",
            // },
        ],
    };

    return NextResponse.json(data, { status: 200 });
}
