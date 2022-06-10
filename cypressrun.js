const cy2 = require("cy2");
const fs = require("fs");
const testServerURL = process.env.TEST_SERVER_URL || "http://localhost:1234/";

(async () => {
    const AWSHelper = require("diu-data-functions").Helpers.Aws;
    try {
        const credentials = JSON.parse(await AWSHelper.getSecrets("cypressaccounts"));
        fs.writeFileSync("./cypress/fixtures/users.json", JSON.stringify(credentials));

        const jwtCredentials = JSON.parse(await AWSHelper.getSecrets("jwt"));
        fs.writeFileSync("./cypress/fixtures/jwtCredentials.json", JSON.stringify(jwtCredentials));

        cy2.run(testServerURL, "cy2").then(() => {
            console.log("Setup complete. Proceeding with Cypress...");
        });
    } catch (error) {
        console.error(error);
    }
})();
