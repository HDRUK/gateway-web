import { render } from "@/utils/testUtils";
import CMSPromoTemplate from "./CMSPromoTemplate";

describe("CMSPromoTemplate", () => {
    const mockData = {
        id: "1",
        title: "Cohort Discovery Page",
        template: {
            promofields: {
                bannerTitle: "Cohort Discovery",
                ctaLink: {
                    title: "Button title",
                    url: "button/url",
                    target: "",
                },
                topRightPanel:
                    '<p><iframe loading="lazy" title="Cohort Discovery on the Health Data Research Innovation Gateway" width="500" height="281" src="https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></p>\n',
                topLeftPanel:
                    "<h2>About Cohort Discovery</h2>\n" +
                    '<p>Statistical disclosure control policies are in place for each data custodian, so low numbers are excluded from query results and results may also be rounded to eliminate any potential risk of identification.This functionality has been developed as part of the CO-CONNECT programme and further information can be found on their <a href="https://co-connect.ac.uk/">website</a>. The summary metadata of the current datasets that are available to query via Cohort Discovery can be found in this <a href="https://www.healthdatagateway.org/">Collection</a> on the Gateway.</p>\n',
                middlePanel:
                    "<h3>How you can request access to Cohort Discovery</h3>\n" +
                    '<p><img loading="lazy" decoding="async" class=" wp-image-130 aligncenter" src="https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image-300x274.png" alt="Search and analyse medical groups" width="395" height="361" srcset="https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image-300x274.png 300w, https://storage.googleapis.com/hdrgatewaywordpresspoc/2023/12/e3b24faf-cohort-user-image.png 601w" sizes="(max-width: 395px) 100vw, 395px" /></p>\n',
            },
        },
    };
    it("should render content", () => {
        const wrapper = render(<CMSPromoTemplate content={mockData} />);
        expect(wrapper.container).toMatchSnapshot();
    });
});
