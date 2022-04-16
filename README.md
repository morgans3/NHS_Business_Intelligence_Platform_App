# NHS BI Platform Application(s)

Our application is a BI Platform along with a collection of other optional, configurable tools such as Population Health Management and Place Based Intelligence.

Demo: <https://www.nhs-bi-platform.co.uk/> (login required)

## Pre-requisites

- Typescript v2.7 or later installed
- Node.js v10.13.0 or later installed
- NPM v6.14.5 or later installed
- API endpoints for retrieving data from the backend databases, as outlined in the documentation in: <https://github.com/morgans3/NHS_Business_Intelligence_Platform>

## Deployment

This code will can be compiled and deployed as a folder of web assets (index.html, js files, etc) or as a docker container. For a method of automating the deployment of this server, along with the rest of our BI platform, please refer to: <https://github.com/morgans3/NHS_Business_Intelligence_Platform>

## Useful commands

- `ng serve` will run the application locally on port 4200
- `npm install` will download all of the required packages (must be done prior to running the application)
- `npm run build` will compile and build the assets for the application
- `npm run test` performs the jest unit tests
- `npm run e2e-open` runs the cypress tests locally
- `npm run compodoc_update` compiles the documentation for the application

## Terms of Use

This specific code repository and all code within is © Crown copyright and available under the terms of the Open Government 3.0 licence.

The code has been developed and is maintained by the NHS and where possible we will try to adhere to the NHS Open Source Policy (<https://github.com/nhsx/open-source-policy/blob/main/open-source-policy.md>).

It shall remain free to the NHS and all UK public services.

### Contributions

This code has been authored by colleagues in the Digital Intelligence Unit @ NHS Blackpool CCG.

### Common Issues (Troubleshooting)

#### Multiple locally stored AWS credentials

If you have multiple locally stored AWS credentials, or if you are not sure that you have a key stored with progammatic access, you should check your local machine:

- Linux and macOS: `~/.aws/config` or `~/.aws/credentials`
- Windows: `%USERPROFILE%\.aws\config` or `%USERPROFILE%\.aws\credentials`

To select a non-default account, run the cdk commands with the profile flag on the end like so `cdk bootstrap --profile myprofilename`

#### NPM package issues

If NPM runs into an issue installing the packages due to the dependencies being out of sync with version number, you can run `npm install --legacy-peer-deps` to fix it.

_This project and all code within is © Crown copyright and available under the terms of the Open Government 3.0 licence._
