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

// // --- Array to store network logs in memory ---
// const networkLogs: string[] = [];

// // --- Intercept all network requests ---
// beforeEach(() => {
//   cy.intercept("/localhost:8000/api/**", (req) => {
//     // log the response once it's received
//     req.continue((res) => {
//       if (!res.statusCode || res.statusCode >= 400) {
//         console.error(`❌ ${req.method} ${req.url} -> ${res.statusCode}`);
//         networkLogs.push(`ERROR ${req.method} ${req.url} -> ${res.statusCode}`);
//       } else {
//         console.log(`✅ ${req.method} ${req.url} -> ${res.statusCode}`);
//         networkLogs.push(`${req.method} ${req.url} -> ${res.statusCode}`);
//       }
//     });
//   });
// });

// // --- After each test, flush logs to the Node task ---
// afterEach(() => {
//   if (networkLogs.length > 0) {
//     // flush logs to file via cy.task
//     cy.task("networkLog", networkLogs.join("\n"));
//     // clear the array for the next test
//     networkLogs.length = 0;
//   }
// });