const { convertToPascalCase } = require("./api-utils");
const { getRubricByTaskType } = require("./api.js");
let _openAIPromptText = null,
  _openAIBaseURL = null,
  _openAIModel = null,
  _client = null;
const axios = require("axios");

// initialise the openAI client
const initialiseChatGPT = ({
  openAIAPIKey,
  openAIPromptText,
  openAIBaseURL,
  openAIModel,
}) => {
  _openAIPromptText = openAIPromptText;
  _openAIBaseURL = openAIBaseURL;
  _openAIModel = openAIModel;
  _client =
    _client ||
    axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIAPIKey}`,
      },
    });
};

// format a prompt for the openAI API
const getWritingTask = (prompt) => {
  if (!prompt) return "";
  return `${prompt.text} \n\n Stimuli \n ${prompt.stimulus}`;
};

// get the rubrics for the given taskType
const getRubricsByTaskType = async (taskType) => {
  let rubrics = [];
  if (taskType && taskType !== "") {
    rubrics = await getRubricByTaskType(taskType);
  } else {
    throw new Error(
      "Tasktype was not received as parameter to get the maxscore of rubrics"
    );
  }
  return rubrics;
};

// format the faculty mark for the openAI API
const getFacultyMark = async (mark, taskType) => {
  if (!mark || !taskType) return false;

  const rubricsPerTaskType = await getRubricsByTaskType(
    convertToPascalCase(taskType)
  );

  let totalItems = 0;
  let totalscore = 0;
  const facultyMark = Object.values(mark)
    .sort((mark1, mark2) =>
      mark1.rubricCategory.localeCompare(mark2.rubricCategory)
    )
    .map((item) => {
      const rubric = rubricsPerTaskType.find(
        (r) => r.rubricName.toLowerCase() === item.rubricCategory.toLowerCase()
      );
      totalItems += parseInt(rubric?.maxScore, 10);
      totalscore += parseInt(item.score, 10);

      return `${item.rubricCategory} : ${item.score} / ${rubric?.maxScore}\n`;
    });

  facultyMark.push(`Overall mark ${totalscore} / ${totalItems} \n`);

  if (facultyMark) {
    return { text: facultyMark.join(" "), totalItems };
  }
  return false;
};

// Define the schema that chatgp will use for response.
const chatGPTResponseSchema = {
  type: "object",
  properties: {
    rubricsFeedback: {
      type: "array",
      description: "array with all the rubrics with their feedback.",
      items: {
        type: "object",
        properties: {
          rubric: {
            type: "string",
            description: "rubric name for the received feedback",
          },
          feedback: {
            type: "string",
            description:
              "feedback received from chatgpt for that specific rubric",
          },
        },
      },
    },
  },
};

// Sometimes openAI returns extra stuff in the feedback, this method is in charge of handling that extra.
const checkExtraDataComingFromOpenAI = (content) => {
  if (content && content !== "") {
    // validate if first three characs are in this template Number/Number, => this is the score we sent, openAI shouldn't return that but randomly does it.
    if (
      !isNaN(content.charAt(0)) &&
      content.charAt(1) === "/" &&
      !isNaN(content.charAt(2))
    ) {
      content = content.substring(3);
    }
    if (content.includes("Quote")) {
      content = content.replace("Quote", "");
    }
    if (content.includes("(Grade")) {
      content = content.replace("(Grade", "");
    }

    return content;
  }
  return content;
};

// get the contextual feedback from the openAI API
const processChatGpt = async (essayMarks, essay, prompt) => {
  if (!prompt) return false;

  const question = getWritingTask(prompt);
  const essay_response = essay?.essayText;

  const { promptName } = prompt;

  const faculty_mark = await getFacultyMark(
    essayMarks?.mark,
    essayMarks?.taskType
  );

  if (!question || !essay_response || !faculty_mark) return null;

  const format = `
      You will give the feedback in the following format:
      Area of rubric: Feedback For That Area Based On Work + Grade
    `;

  const instruction = `
       ${_openAIPromptText}
       ${format}
      `;

  const messages = [
    { role: "system", content: instruction },
    { role: "user", content: promptName },
    { role: "user", content: essay_response },
    { role: "user", content: faculty_mark.text },
  ];

  const response = await _client.post(_openAIBaseURL, {
    model: _openAIModel,
    messages,
    functions: [{ name: "set_feedback", parameters: chatGPTResponseSchema }],
    function_call: { name: "set_feedback" },
  });
  const mapRubric = {};

  const formattedResponse =
    response.data.choices && response.data.choices.length > 0
      ? response.data.choices[0].message.function_call.arguments
      : {};

  const rubricsFeedback = JSON.parse(formattedResponse)?.rubricsFeedback;

  rubricsFeedback.forEach((record) => {
    if (record?.rubric && record.feedback) {
      let rubric = record.rubric;
      let feedback = record.feedback;

      rubric = rubric.trim().toLowerCase().replace(/\s+/g, "-");

      feedback = checkExtraDataComingFromOpenAI(feedback.trim());

      mapRubric[rubric] = feedback;
    }
  });
  return mapRubric;
};

// Sometimes openAI returns extra stuff in the feedback, this method is in charge of removing that extra.
module.exports = {
  initialiseChatGPT,
  processChatGpt,
};
