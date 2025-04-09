const { capitalizeWords } = require("./utils");

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

const submitCommandView = (updatedBlocks) => (initialUser) => ({
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
        ...(initialUser ? { initial_user: initialUser } : {}),
        placeholder: {
          type: "plain_text",
          text: "Select a user",
        },
      },
    },
    {
      type: "input",
      block_id: "feedback_type_selection",
      dispatch_action: true,
      label: {
        type: "plain_text",
        text: "Select a feedback Template:",
      },
      element: {
        type: "static_select",
        action_id: "feedback_type_select",
        placeholder: {
          type: "plain_text",
          text: "Select a feedback type",
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "General Feedback",
            },
            value: "gen",
          },
          {
            text: {
              type: "plain_text",
              text: "Traits List",
            },
            value: "traits",
          },
        ],
      },
    },
    ...(updatedBlocks ?? []),
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

const generalFeedbackForm = () => [
  {
    type: "divider",
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Help your teammate grow with thoughtful, specific feedback.*\n\nYou can respond to one, some, or all of the questions below — whatever feels most helpful. Be candid and honest. Don't feel pressured to answer every question. If you don't have meaningful feedback for a prompt, feel free to skip it. \n\nWhen writing your feedback, think about what will truly help your teammates improve and thrive. Be specific and focus on behaviors like what they're doing that works well, and what might be holding them back.",
    },
  },
  {
    type: "divider",
  },
  {
    type: "input",
    optional: true,
    block_id: "habits_input",
    label: {
      type: "plain_text",
      text: "What habits or actions do you notice that help them succeed?",
    },
    element: {
      type: "plain_text_input",
      action_id: "habits_text",
      multiline: true,
      placeholder: {
        type: "plain_text",
        text: "Share specific behaviors that contribute to their success...",
      },
    },
  },
  {
    type: "input",
    optional: true,
    block_id: "growth_input",
    label: {
      type: "plain_text",
      text: "What is one habit or action they could adopt to be even more effective?",
    },
    element: {
      type: "plain_text_input",
      action_id: "growth_text",
      multiline: true,
      placeholder: {
        type: "plain_text",
        text: "Suggest something that could increase their effectiveness...",
      },
    },
  },
  {
    type: "input",
    optional: true,
    block_id: "invisible_value_input",
    label: {
      type: "plain_text",
      text: "What value do they bring to themselves, their work, or their team that might not be immediately visible?",
    },
    element: {
      type: "plain_text_input",
      action_id: "invisible_value_text",
      multiline: true,
      placeholder: {
        type: "plain_text",
        text: "Call out the unseen or underappreciated things they bring...",
      },
    },
  },
  {
    type: "input",
    optional: true,
    block_id: "additional_input",
    label: {
      type: "plain_text",
      text: "Is there anything else you'd like to add that you couldn't fit into one of the above questions?",
    },
    element: {
      type: "plain_text_input",
      action_id: "additional_text",
      multiline: true,
      placeholder: {
        type: "plain_text",
        text: "Leave any final thoughts, shout-outs, or suggestions here...",
      },
    },
  },
];

const categoryOptions = {
  work_execution: [
    { text: "Delivers high-quality work", value: "high_quality_work" },
    { text: "Meets deadlines reliably", value: "meets_deadlines" },
    { text: "Takes ownership of their work", value: "takes_ownership" },
    {
      text: "Balances speed and attention to detail",
      value: "balances_speed_detail",
    },
    { text: "Manages scope effectively", value: "manages_scope" },
  ],
  collaboration_communication: [
    { text: "Communicates clearly", value: "communicates_clearly" },
    { text: "Listens actively and respectfully", value: "listens_actively" },
    {
      text: "Responds to feedback constructively",
      value: "responds_to_feedback",
    },
    { text: "Keeps others in the loop", value: "keeps_others_in_loop" },
    {
      text: "Supports cross-functional teammates",
      value: "supports_teammates",
    },
  ],
  team_culture: [
    { text: "Uplifts team morale", value: "uplifts_morale" },
    { text: "Mentors or supports others", value: "mentors_supports" },
    { text: "Lives up to our values", value: "lives_up_to_values" },
    { text: "Open to new ideas and perspectives", value: "open_to_ideas" },
    {
      text: "Proactively identifies and solves problems",
      value: "solves_problems",
    },
  ],
  technical_problem_solving: [
    { text: "Writes clean, maintainable code", value: "clean_code" },
    { text: "Makes sound technical decisions", value: "sound_decisions" },
    { text: "Contributes to code reviews", value: "code_reviews" },
    { text: "Seeks and shares technical knowledge", value: "shares_knowledge" },
    { text: "Designs with security in mind", value: "security_design" },
  ],
  customer_product_focus: [
    { text: "Understands user needs", value: "understands_user_needs" },
    { text: "Aligns work with product goals", value: "aligns_with_goals" },
    { text: "Prioritizes impact over output", value: "prioritizes_impact" },
    { text: "Helps bridge product/engineering gaps", value: "bridges_gaps" },
    {
      text: "Makes security tradeoffs thoughtfully",
      value: "security_tradeoffs",
    },
  ],
};

const categoryLabels = {
  work_execution: "Work Execution",
  collaboration_communication: "Collaboration & Communication",
  team_culture: "Team Culture",
  technical_problem_solving: "Technical Problem Solving",
  customer_product_focus: "Customer & Product Focus",
};

const categoryDescriptions = {
  work_execution:
    "How well does this person execute their work? Do they deliver high-quality work on time, and take ownership of their projects?",
  collaboration_communication:
    "How well does this person communicate and collaborate with others? Do they listen actively, respond to feedback, and keep others informed?",
  team_culture:
    "How well does this person contribute to team culture? Do they uplift team morale, mentor others, and live up to our values?",
  technical_problem_solving:
    "How well does this person solve technical problems? Do they write clean code, make sound decisions, and contribute to code reviews?",
  customer_product_focus:
    "How well does this person focus on customer and product needs? Do they understand user needs, align work with goals, and prioritize impact?",
};

const traitsListForm = () => [
  {
    type: "divider",
  },
  {
    type: "section",
    block_id: "description",
    text: {
      type: "mrkdwn",
      text: "*Help your teammate grow with thoughtful, specific feedback.*\n\nYou can select up to 3 strengths and 3 areas of improvement for each section below. Be candid and honest. Don't feel pressured to select options for every category. If you don't have meaningful feedback for a section, feel free to skip it.\n\nWhen making your selections, think about what will truly help your teammates improve and thrive. Focus on specific behaviors like what they're doing well, and where they might benefit from growth.",
    },
  },
  {
    type: "divider",
  },
  ...Object.keys(categoryOptions)
    .map((category, index) => [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${categoryLabels[category]}* — ${categoryDescriptions[category]}`,
        },
      },
      {
        type: "input",
        block_id: `${category}_strengths`,
        optional: true,
        label: {
          type: "plain_text",
          text: `Strengths`,
        },
        element: {
          type: "multi_static_select",
          action_id: `${category}_strengths_select`,
          placeholder: {
            type: "plain_text",
            text: "Select strengths",
          },
          options: categoryOptions[category].map((option) => ({
            text: { type: "plain_text", text: option.text },
            value: option.value,
          })),
          max_selected_items: 3,
        },
      },
      {
        type: "input",
        optional: true,
        block_id: `${category}_improvement`,
        label: {
          type: "plain_text",
          text: `Areas of Improvement`,
        },
        element: {
          type: "multi_static_select",
          action_id: `${category}_improvement_select`,
          placeholder: {
            type: "plain_text",
            text: "Select areas for improvement",
          },
          options: categoryOptions[category].map((option) => ({
            text: { type: "plain_text", text: option.text },
            value: option.value,
          })),
          max_selected_items: 3,
        },
      },
      index < Object.keys(categoryOptions).length - 1
        ? { type: "divider" }
        : null,
    ])
    .flat()
    .filter(Boolean),
];

const parseQuestionAnswer = (qas) =>
  qas.map(({ question, answer }, index) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${index + 1}. ${question}*\n${answer}`,
    },
  }));

const parseGeneralFeedback = (view) => {
  const values = view.state.values;
  const blocks = view.blocks;
  const answers = [];

  for (const block of blocks) {
    if (block.type === "input" && block.element?.type === "plain_text_input") {
      const blockId = block.block_id;
      const actionId = block.element.action_id;
      const question = block.label.text;
      const answer = values[blockId]?.[actionId]?.value;

      if (answer && answer.trim() !== "") {
        answers.push({ question, answer });
      }
    }
  }

  return {
    label: "General",
    body: parseQuestionAnswer(answers),
  };
};

const parseTraitsList = (view) => {
  const values = view.state.values;
  console.log("values", JSON.stringify(values, null, 2));
  // List of block IDs for categories
  const categories = Object.keys(categoryOptions);

  // Function to extract selected options for strengths and areas of improvement
  const getSelections = (category, type) => {
    const blockId = `${category}_${type}`;
    return values[blockId][`${blockId}_select`].selected_options.map(
      (option) => option.value
    );
  };

  const result = {
    label: "Traits",
    body: parseQuestionAnswer(
      categories.flatMap((category) => {
        const strengthSelections = getSelections(category, "strengths");
        const improvementSelections = getSelections(category, "improvement");
        if (!strengthSelections.length && !improvementSelections.length)
          return [];
        const strengthsText = strengthSelections
          .map((s) => capitalizeWords(s.replace(/_/g, " ")))
          .join("\n\t- ");
        const improvementText = improvementSelections
          .map((i) => capitalizeWords(i.replace(/_/g, " ")))
          .join("\n\t-");
        const strengths = !!strengthsText
          ? `_Strengths:_\n\t- ${strengthsText}`
          : "";
        const improvement = !!improvementText
          ? `_Areas for Improvement:_\n\t- ${improvementText}`
          : "";

        return [
          {
            question: `${categoryLabels[category]}:`,
            answer: `${strengths}${
              !!strengths && !!improvement ? "\n" : ""
            }${improvement}`,
          },
        ];
      })
    ),
  };

  return result;
};

const parseFeedback = (view) => {
  const selectedFeedbackType =
    view.state.values.feedback_type_selection.feedback_type_select
      .selected_option.value;
  switch (selectedFeedbackType) {
    case "gen":
      return parseGeneralFeedback(view);
    case "traits":
      return parseTraitsList(view);
    default:
      return `UNKNOWN FEEDBACK TYPE: ${selectedFeedbackType}`;
  }
};

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
  generalFeedbackForm,
  traitsListForm,
  parseFeedback,
};
