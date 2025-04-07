const { App } = require("@slack/bolt");

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

/**
 * Returns the secret string from Google Cloud Secret Manager
 * @param {string} name The name of the secret.
 * @return {Promise<string>} The string value of the secret.
 */
async function accessSecretVersion(name) {
  const client = new SecretManagerServiceClient();
  const projectId = process.env.PROJECT_ID;
  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${name}/versions/1`,
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString("utf8");

  return payload;
}

/* Add functionality here */

(async () => {
  const app = new App({
    signingSecret: await accessSecretVersion("client-signing-secret"),
    token: await accessSecretVersion("bot-token"),
  });

  app.command("/reverb", async ({ command, ack, client }) => {
    // Acknowledge the command request
    await ack();

    try {
      // Open a modal
      await client.views.open({
        trigger_id: command.trigger_id,
        view: {
          type: "modal",
          callback_id: "modal_callback",
          title: {
            type: "plain_text",
            text: "Feedback Modal",
          },
          blocks: [
            {
              type: "input",
              block_id: "feedback_block",
              label: {
                type: "plain_text",
                text: "Your Feedback",
              },
              element: {
                type: "plain_text_input",
                action_id: "feedback_input",
              },
            },
          ],
          submit: {
            type: "plain_text",
            text: "Submit",
          },
        },
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  });

  app.view("modal_callback", async ({ ack, body, view, client }) => {
    // Acknowledge the view submission
    await ack();

    // Extract the feedback input
    const feedback = view.state.values.feedback_block.feedback_input.value;

    // Log or process the feedback
    console.log(`Feedback received: ${feedback}`);

    // Optionally send a message back to the user
    try {
      await client.chat.postMessage({
        channel: body.user.id,
        text: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
