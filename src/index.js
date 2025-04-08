const { App, ExpressReceiver } = require("@slack/bolt");
const getConfig = require("./config.js");
const {
  reverbCommandHandler,
  // actions
  commandSelectActionHandler,
  feedbackTypeActionHandler,
  // views
  requestFeedbackViewHandler,
  submitFeedbackViewHandler,
} = require("./handlers.js");

(async () => {
  const config = await getConfig();
  const receiver = new ExpressReceiver(config);
  const app = new App({ receiver });

  app.command("/reverb", reverbCommandHandler);

  app.action("command_select", commandSelectActionHandler);

  app.action("feedback_type_select", feedbackTypeActionHandler);

  app.view("request_feedback", requestFeedbackViewHandler);

  app.view("submit_feedback", submitFeedbackViewHandler);

  receiver.app.get("/ping", (req, res) => {
    res.send({ pong: new Date() });
  });

  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
