import { capitalise, copyToClipboard } from "./general";
import notificationService from "@/services/notification";
import userEvent from "@testing-library/user-event";
import { screen } from "@/utils/testUtils";


describe("General utils", () => {
    it("should return capitalised string", async () => {
        expect(capitalise("string")).toEqual("String");
    });

    /*it("should have copied to clipboard and notify", async () => {

        //userEvent.click(

        copyToClipboard("copy this");

        //expect(writeTextSpy).toHaveBeenCalledWith("copy this");
        //expect(successSpy).toHaveBeenCalledWith("Link copied");

    });*/
});
