import "cypress-xpath";
import "./commands";

Cypress.on("uncaught:exception", err => {
    const msg = err?.message ?? "";
    if (
        msg.includes("Failed to execute 'measure' on 'Performance'") &&
        msg.includes("NotFound") &&
        msg.includes("negative time stamp")
    ) {
        return false;
    }
    return true;
});
