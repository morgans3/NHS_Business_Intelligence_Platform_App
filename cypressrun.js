const cy2 = require("cy2");
const testServerURL = process.env.TEST_SERVER_URL || "http://localhost:1234/";

cy2.run(testServerURL, "cy2").then((res) => {
  console.log(res);
});

// webhook = "https://nhs.webhook.office.com/webhookb2/3ea40dc5-9916-427c-93fc-480765d67222@37c354b2-85b0-47f5-b222-07b48d774ee3/IncomingWebhook/e6b01ea5b9924d609e5d4bda52380a6d/1cb487ac-692c-488f-9280-2ec46e31c0ea"
