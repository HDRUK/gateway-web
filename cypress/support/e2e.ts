import "./commands";

Cypress.on("uncaught:exception", (err) => {
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

beforeEach(() => {
  cy.intercept("**", (req) => {

    req.on("error", (err) => {
      cy.task("networkLog", `ERROR ${req.method} ${req.url} ${err.message}`);
    });

    req.on("response", (res) => {
      cy.task("networkLog", `${req.method} ${req.url} -> ${res.statusCode}`);
    });

  });
});