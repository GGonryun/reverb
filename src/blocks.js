const selectCommandModal = (command) => ({
  trigger_id: command.trigger_id,
  view: {
    type: "modal",
    callback_id: "select_command",
    title: {
      type: "plain_text",
      text: "Reverb Command",
    },
    blocks: [
      {
        type: "section",
        block_id: "command_selection",
        text: {
          type: "mrkdwn",
          text: "Choose a command:",
        },
        accessory: {
          type: "static_select",
          action_id: "command_select",
          placeholder: {
            type: "plain_text",
            text: "Select a command",
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "Request Feedback",
              },
              value: "request",
            },
            {
              text: {
                type: "plain_text",
                text: "Submit Feedback",
              },
              value: "submit",
            },
            {
              text: {
                type: "plain_text",
                text: "Remind to Request",
              },
              value: "remind",
            },
          ],
        },
      },
    ],
  },
});

const requestCommandView = () => ({
  type: "modal",
  callback_id: "request_feedback",
  title: {
    type: "plain_text",
    text: "Request Feedback",
  },
  blocks: [
    {
      type: "input",
      block_id: "user_selection",
      label: {
        type: "plain_text",
        text: "Select users to request feedback from:",
      },
      element: {
        type: "multi_users_select",
        action_id: "users_select",
        placeholder: {
          type: "plain_text",
          text: "Select users",
        },
      },
    },
  ],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
});

const submitCommandView = (initialUser) => ({
  type: "modal",
  callback_id: "submit_feedback",
  title: {
    type: "plain_text",
    text: "Submit Feedback",
  },
  blocks: [
    {
      type: "input",
      block_id: "user_selection",
      label: {
        type: "plain_text",
        text: "Select a user to give feedback to:",
      },
      element: {
        type: "users_select",
        action_id: "user_select",
        ...(initialUser ? { initial_user: initialUser } : {}), // Pre-fill with the initial user if provided
        placeholder: {
          type: "plain_text",
          text: "Select a user",
        },
      },
    },
    {
      type: "input",
      block_id: "feedback_input",
      label: {
        type: "plain_text",
        text: "Your Feedback:",
      },
      element: {
        type: "plain_text_input",
        action_id: "feedback_text",
      },
    },
  ],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
});

const helpMessage = () => ({
  text:
    "*Reverb Command Help*\n\n" +
    "Here are the commands you can use with `/reverb`:\n" +
    "• `/reverb` - Opens a modal to select one of the following commands:\n" +
    "  - `/reverb request`: *Request Feedback* — Select multiple users to request feedback from.\n" +
    "  - `/reverb submit`: *Submit Feedback* — Select a single user and submit plaintext feedback.\n" +
    "• `/reverb help` - Displays this help message.",
  response_type: "ephemeral", // Only visible to the user who typed the command
});

const unrecognizedCommandMessage = () => ({
  text: "I'm sorry, I didn't understand that command. Please use `/reverb help` to see the available commands.",
  response_type: "ephemeral", // Only visible to the user who typed the command
});

module.exports = {
  selectCommandModal,
  helpMessage,
  requestCommandView,
  submitCommandView,
  unrecognizedCommandMessage,
};
