// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    name: "Development",
    version: "1.0.0",
    production: false,
    userNameDev: "Demo.User@nhs.net",
    homepage: "landing",
    appName: "Nexus Intelligence",
    isDemo: true,
    admins: ["stewart.morgan@nhs.net"],
    websiteURL: "localhost:8079"
    // websiteURL: "dev.nexusintelligencenw.nhs.uk",
};
