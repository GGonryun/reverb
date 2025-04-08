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
              text: "Traits Checklist",
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

const strengthsQuestion = "What is one thing this person does really well?";
const improvementQuestion =
  "What is one thing they could do to be even more effective?";
const contributionsQuestion = "How do they contribute to the team's success?";

const generalFeedbackForm = () => [
  {
    type: "input",
    block_id: "strengths_input",
    label: {
      type: "plain_text",
      text: strengthsQuestion,
    },
    element: {
      type: "plain_text_input",
      action_id: "strengths_text",
      placeholder: {
        type: "plain_text",
        text: "Write about their strengths...",
      },
    },
  },
  {
    type: "input",
    block_id: "improvement_input",
    label: {
      type: "plain_text",
      text: improvementQuestion,
    },
    element: {
      type: "plain_text_input",
      action_id: "improvement_text",
      placeholder: {
        type: "plain_text",
        text: "Write about areas for improvement...",
      },
    },
  },
  {
    type: "input",
    block_id: "team_contribution_input",
    label: {
      type: "plain_text",
      text: contributionsQuestion,
    },
    element: {
      type: "plain_text_input",
      action_id: "team_contribution_text",
      placeholder: {
        type: "plain_text",
        text: "Write about their contributions to the team...",
      },
    },
  },
];

const traitsChecklistForm = () => [
  {
    type: "section",
    block_id: "description",
    text: {
      type: "mrkdwn",
      text: "*Select at most 3 traits for each section.*",
    },
  },
  {
    type: "input",
    block_id: "work_execution",
    label: {
      type: "plain_text",
      text: "Work & Execution",
    },
    element: {
      type: "checkboxes",
      action_id: "work_execution_select",
      options: [
        {
          text: {
            type: "plain_text",
            text: "Delivers high-quality work",
          },
          value: "high_quality_work",
        },
        {
          text: {
            type: "plain_text",
            text: "Meets deadlines reliably",
          },
          value: "meets_deadlines",
        },
        {
          text: {
            type: "plain_text",
            text: "Takes ownership of their work",
          },
          value: "takes_ownership",
        },
        {
          text: {
            type: "plain_text",
            text: "Balances speed and attention to detail",
          },
          value: "balances_speed_detail",
        },
        {
          text: {
            type: "plain_text",
            text: "Manages scope effectively",
          },
          value: "manages_scope",
        },
      ],
    },
  },
  {
    type: "input",
    block_id: "collaboration_communication",
    label: {
      type: "plain_text",
      text: "Collaboration & Communication",
    },
    element: {
      type: "checkboxes",
      action_id: "collaboration_communication_select",
      options: [
        {
          text: {
            type: "plain_text",
            text: "Communicates clearly",
          },
          value: "communicates_clearly",
        },
        {
          text: {
            type: "plain_text",
            text: "Listens actively and respectfully",
          },
          value: "listens_actively",
        },
        {
          text: {
            type: "plain_text",
            text: "Responds to feedback constructively",
          },
          value: "responds_to_feedback",
        },
        {
          text: {
            type: "plain_text",
            text: "Keeps others in the loop",
          },
          value: "keeps_others_in_loop",
        },
        {
          text: {
            type: "plain_text",
            text: "Supports cross-functional teammates",
          },
          value: "supports_teammates",
        },
      ],
    },
  },
  {
    type: "input",
    block_id: "team_culture",
    label: {
      type: "plain_text",
      text: "Team & Culture",
    },
    element: {
      type: "checkboxes",
      action_id: "team_culture_select",
      options: [
        {
          text: {
            type: "plain_text",
            text: "Uplifts team morale",
          },
          value: "uplifts_morale",
        },
        {
          text: {
            type: "plain_text",
            text: "Mentors or supports others",
          },
          value: "mentors_supports",
        },
        {
          text: {
            type: "plain_text",
            text: "Lives up to our values",
          },
          value: "lives_up_to_values",
        },
        {
          text: {
            type: "plain_text",
            text: "Open to new ideas and perspectives",
          },
          value: "open_to_ideas",
        },
        {
          text: {
            type: "plain_text",
            text: "Proactively identifies and solves problems",
          },
          value: "solves_problems",
        },
      ],
    },
  },
  {
    type: "input",
    block_id: "technical_problem_solving",
    label: {
      type: "plain_text",
      text: "Technical & Problem Solving (for engineers)",
    },
    element: {
      type: "checkboxes",
      action_id: "technical_problem_solving_select",
      options: [
        {
          text: {
            type: "plain_text",
            text: "Not Applicable",
          },
          value: "not_applicable",
        },
        {
          text: {
            type: "plain_text",
            text: "Writes clean, maintainable code",
          },
          value: "clean_code",
        },
        {
          text: {
            type: "plain_text",
            text: "Makes sound technical decisions",
          },
          value: "sound_decisions",
        },
        {
          text: {
            type: "plain_text",
            text: "Contributes to code reviews",
          },
          value: "code_reviews",
        },
        {
          text: {
            type: "plain_text",
            text: "Seeks and shares technical knowledge",
          },
          value: "shares_knowledge",
        },
        {
          text: {
            type: "plain_text",
            text: "Designs with security in mind",
          },
          value: "security_design",
        },
      ],
    },
  },
  {
    type: "input",
    block_id: "customer_product_focus",
    label: {
      type: "plain_text",
      text: "Customer & Product Focus",
    },
    element: {
      type: "checkboxes",
      action_id: "customer_product_focus_select",
      options: [
        {
          text: {
            type: "plain_text",
            text: "Understands user needs",
          },
          value: "understands_user_needs",
        },
        {
          text: {
            type: "plain_text",
            text: "Aligns work with product goals",
          },
          value: "aligns_with_goals",
        },
        {
          text: {
            type: "plain_text",
            text: "Prioritizes impact over output",
          },
          value: "prioritizes_impact",
        },
        {
          text: {
            type: "plain_text",
            text: "Helps bridge product/engineering gaps",
          },
          value: "bridges_gaps",
        },
        {
          text: {
            type: "plain_text",
            text: "Makes security tradeoffs thoughtfully",
          },
          value: "security_tradeoffs",
        },
      ],
    },
  },
];

const parseQuestionAnswer = (qas) =>
  qas.map(({ q, a }, index) => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*${index + 1}. ${q}*\n_${a}_`,
    },
  }));

const parseGeneralFeedback = (values) => {
  const strengths = values.strengths_input.strengths_text.value;
  const improvement = values.improvement_input.improvement_text.value;
  const teamContribution =
    values.team_contribution_input.team_contribution_text.value;

  return {
    label: "General",
    body: parseQuestionAnswer([
      { q: strengthsQuestion, a: strengths },
      { q: improvementQuestion, a: improvement },
      { q: contributionsQuestion, a: teamContribution },
    ]),
  };
};

const parseTraitsChecklist = (values) => {
  console.log(JSON.stringify(values, null, 2));
  const selector = (option) => option.text.text;
  const workExecution =
    values.work_execution.work_execution_select.selected_options.map(selector);

  const collaborationCommunication =
    values.collaboration_communication.collaboration_communication_select.selected_options.map(
      selector
    );
  const teamCulture =
    values.team_culture.team_culture_select.selected_options.map(selector);

  const technicalProblemSolving =
    values.technical_problem_solving.technical_problem_solving_select.selected_options.map(
      selector
    );

  const customerProductFocus =
    values.customer_product_focus.customer_product_focus_select.selected_options.map(
      selector
    );

  return {
    label: "Traits",
    body: parseQuestionAnswer([
      {
        q: "Work & Execution",
        a: workExecution.join(", "),
      },
      {
        q: "Collaboration & Communication",
        a: collaborationCommunication.join(", "),
      },
      {
        q: "Team & Culture",
        a: teamCulture.join(", "),
      },
      {
        q: "Technical & Problem Solving (for engineers)",
        a: technicalProblemSolving.join(", "),
      },
      {
        q: "Customer & Product Focus",
        a: customerProductFocus.join(", "),
      },
    ]),
  };
};

const parseFeedback = (values) => {
  const selectedFeedbackType =
    values.feedback_type_selection.feedback_type_select.selected_option.value;
  switch (selectedFeedbackType) {
    case "gen":
      return parseGeneralFeedback(values);
    case "traits":
      return parseTraitsChecklist(values);
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
  traitsChecklistForm,
  parseFeedback,
};
