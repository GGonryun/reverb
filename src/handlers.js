const {
  selectCommandModal,
  helpMessage,
  requestCommandView,
  submitCommandView,
  unrecognizedCommandMessage,
  generalFeedbackForm,
  parseFeedback,
  traitsListForm,
} = require("./blocks.js");
const { parseUser } = require("./utils.js");

const determineViewForCommand = (selectedCommand, commandArgs) => {
  switch (selectedCommand) {
    case "request":
      return requestCommandView();
    case "submit":
      return submitCommandView()(parseUser(commandArgs?.at(0)));
    default:
      return undefined;
  }
};

const determineFeedbackForm = (selectedFeedbackType) => {
  switch (selectedFeedbackType) {
    case "gen":
      return generalFeedbackForm();
    case "traits":
      return traitsListForm();
    default:
      return undefined;
  }
};

const reverbCommandHandler = async ({ command, ack, client, respond }) => {
  console.log("Opening modal for command:", JSON.stringify(command, null, 2));

  try {
    await ack();

    // Get the first word of the command text
    const commandInputs = command.text.trim().split(" ");
    const [selectedCommand, ...commandArgs] = commandInputs;
    if (!selectedCommand) {
      await client.views.open(selectCommandModal(command));
    } else if (selectedCommand === "help") {
      // Respond with a help message
      await respond(helpMessage());
    } else {
      const view = determineViewForCommand(selectedCommand, commandArgs);
      if (!view) {
        // Fallback to help if the command is not recognized
        await respond(unrecognizedCommandMessage());
      } else {
        await client.views.open({
          trigger_id: command.trigger_id,
          view,
        });
      }
    }
  } catch (error) {
    console.error("Error executing command:", JSON.stringify(error, null, 2));
  }
};

const commandSelectActionHandler = async ({ ack, body, client }) => {
  await ack();

  const selectedCommand = body.actions[0].selected_option.value;

  // Update the modal with the selected command's view
  await client.views.update({
    view_id: body.view.id,
    view: determineViewForCommand(selectedCommand),
  });
};

const requestFeedbackViewHandler = async ({ ack, body, view, client }) => {
  await ack();

  const selectedUsers =
    view.state.values.user_selection.users_select.selected_users;
  const targetUser = body.user.id; // The user who initiated the request

  console.log(`Request feedback from: ${selectedUsers} for user ${targetUser}`);
  try {
    // Send a message to each selected user
    for (const user of selectedUsers) {
      await client.chat.postMessage({
        channel: user,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Your Feedback is Requested!",
            },
          },
          { type: "divider" },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `<@${targetUser}> has requested your feedback to support their growth and development. Share your thoughts by clicking the button below.`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Provide Feedback",
                },
                style: "primary",
                value: targetUser,
                action_id: "feedback_button",
              },
            ],
          },
        ],
      });
    }
    console.log(`Feedback requests sent to: ${selectedUsers}`);
  } catch (error) {
    console.error("Error sending feedback requests:", error);
  }
};

const feedbackTypeActionHandler = async ({ ack, body, client }) => {
  const selectedFeedbackType = body.actions[0].selected_option.value;

  const updatedBlocks = determineFeedbackForm(selectedFeedbackType);

  if (!updatedBlocks) {
    console.error("Invalid feedback type selected");
    await ack({
      response_action: "errors",
      errors: {
        feedback_type_selection: "Unexpected feedback type selected.",
      },
    });
  }

  await ack();

  // Update the modal with the new blocks
  await client.views.update({
    view_id: body.view.id,
    view: submitCommandView(updatedBlocks)(),
  });
};

const submitFeedbackViewHandler = async ({ ack, body, view, client }) => {
  await ack();

  const selectedUser =
    view.state.values.user_selection.user_select.selected_user;
  const senderUserId = body.user.id; // The user who submitted the feedback
  const feedback = parseFeedback(view);

  console.log(`Submit feedback to ${selectedUser}: ${feedback}`);
  const header = {
    type: "plain_text",
    text: `You have received ${feedback.label} Feedback!`,
  };
  const author = `Feedback from <@${senderUserId}>`;
  try {
    // Send the feedback as a direct message to the selected user
    await client.chat.postMessage({
      channel: selectedUser,
      blocks: [
        { type: "header", text: header },
        { type: "divider" },
        ...feedback.body,
        { type: "divider" },
        { type: "markdown", text: author },
      ],
    });

    console.log(`Feedback sent to user: ${selectedUser} from ${senderUserId}`);
  } catch (error) {
    console.error("Error sending feedback:", error);
  }
};

const feedbackButtonActionHandler = async ({ ack, body, client }) => {
  // pop up the same modal we'd get for the /reverb command
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: submitCommandView()(body.actions[0].value),
  });
};

module.exports = {
  reverbCommandHandler,
  commandSelectActionHandler,
  requestFeedbackViewHandler,
  submitFeedbackViewHandler,
  feedbackTypeActionHandler,
  feedbackButtonActionHandler,
};
