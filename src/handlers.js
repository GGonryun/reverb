const {
  selectCommandModal,
  helpMessage,
  requestCommandView,
  submitCommandView,
  unrecognizedCommandMessage,
} = require("./blocks.js");
const { parseUser } = require("./utils.js");

const determineViewForCommand = (selectedCommand, commandArgs) => {
  switch (selectedCommand) {
    case "request":
      return requestCommandView();
    case "submit":
      return submitCommandView(parseUser(commandArgs[0]));
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
        text: `<@${user}>, please provide feedback for <@${targetUser}> with command \`/reverb submit <@${targetUser}>\`.`,
      });
    }
    console.log(`Feedback requests sent to: ${selectedUsers}`);
  } catch (error) {
    console.error("Error sending feedback requests:", error);
  }
};

const submitFeedbackViewHandler = async ({ ack, body, view, client }) => {
  await ack();

  const selectedUser =
    view.state.values.user_selection.user_select.selected_user;
  const feedback = view.state.values.feedback_input.feedback_text.value;
  const senderUserId = body.user.id; // The user who submitted the feedback

  console.log(`Submit feedback to ${selectedUser}: ${feedback}`);
  try {
    // Send the feedback as a direct message to the selected user
    await client.chat.postMessage({
      channel: selectedUser,
      text: `You have received feedback from <@${senderUserId}>: "${feedback}"`,
    });

    console.log(`Feedback sent to user: ${selectedUser} from ${senderUserId}`);
  } catch (error) {
    console.error("Error sending feedback:", error);
  }
};

module.exports = {
  reverbCommandHandler,
  commandSelectActionHandler,
  requestFeedbackViewHandler,
  submitFeedbackViewHandler,
};
