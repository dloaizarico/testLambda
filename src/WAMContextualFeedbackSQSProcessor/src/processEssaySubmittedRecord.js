const {
  getActivityPromptByActivityID,
  insertContextualFeedbackStudentEssay,
} = require("./api/api");
const { processChatGpt } = require("./api/openai.js");
const { getEssay, getEssayMark } = require("./api/emtService.js");
const { logger } = require("./logger");

/**
 * process a single "essay submitted" record, getting the ChatGPT response and updating the DB
 * @param {object|string} body - the body of the record, containing an "essayId" property
 * @throws {Error} if there is any problem whatsoever
 */
const processSubmittedEssayRecord = async function (body) {
  // check that required params are on the record
  // body might be stringified; if so then parse it as JSON.
  const bodyObj = typeof body === "string" ? JSON.parse(body) : body;
  const { essayId } = bodyObj;
  if (!essayId) {
    throw new Error("Missing required param: essayId");
  }

  // get the essay from EMT
  const essay = await getEssay(essayId);
  logger.debug("essay", essay);

  /*
  essay is like this:
    {
      essayId: '8b57b0bf-019e-4ded-a144-f1e690e7417e',
      activityId: '6b1b2525-9f03-4e81-a93f-38f16754cbbd',
      studentId: '35e56407-5bc5-4d42-b30f-c706fdce1ba1',
      classroomId: '7e37a9c1-fb37-4339-9a8d-f0c1fe8acde4',
      schoolId: 'e2eee82c-38bc-4af6-a3b8-478251abb63b',
      taskDetails: { taskType: 'NARRATIVE', essayPrompt: 'The Message RTE Demo' },
      essayText: 'Title: The Hidden Code\n' +
        '\n' +
        'In the heart of a bustling city, where towering skyscrapers reached for the heavens, lived two unlikely friends, Max and Leo. Max, an ingenious young coder, was known for his unparalleled skills in decrypting complex codes, while Leo, a gifted artist, had an uncanny ability to perceive the deeper meaning in everything. Their camaraderie flourished in their shared passion for unraveling mysteries that often lay hidden in plain sight.\n' +
        '\n' +
        'One crisp autumn afternoon, Max received an enigmatic message in an old, dusty envelope. The message was written in a cryptic code, unlike anything he had encountered before. It seemed to be a combination of ancient symbols and modern encryption techniques. As he carefully examined the message, his eyes widened with curiosity. Little did he know that this message would lead to an adventure beyond his wildest dreams.\n' +
        '\n' +
        "Max, realizing the magnitude of the challenge, invited Leo to join him in cracking the mysterious code. They met in Max's cluttered attic, which served as their secret headquarters for solving puzzles. With the message laid out on the table, they both immersed themselves in a relentless pursuit of the hidden meaning. Days turned into nights, and their excitement grew, though the elusive code seemed to mock their efforts.\n" +
        '\n' +
        "As they faced the first glimmer of despair, Leo noticed a faint watermark on the envelope that bore the image of a peculiar tree. Leo's artistic instincts kicked in, and he sketched the tree in vivid detail, feeling it might be the missing piece of the puzzle. The duo's enthusiasm reignited as they realized the connection between the tree and the cryptic code. It was a clue, leading them to a botanical garden on the outskirts of the city.\n" +
        '\n' +
        "At the botanical garden, Max and Leo found themselves amidst a vast array of trees. They scoured every inch, searching for a tree that matched Leo's sketch. Just when they were about to give up, they stumbled upon a hidden grove adorned with an ancient tree, identical to Leo's drawing. As they approached the tree, an intricate wooden box came into view, camouflaged within the foliage.\n" +
        '\n' +
        'Eagerly, Max opened the box to find a second encrypted message, which indicated coordinates to a distant island. The journey to the island became a thrilling adventure in itself. They encountered turbulent storms, sailed treacherous waters, and braved uncharted territories. Their determination kept them going, knowing that the answers they sought were waiting to be unraveled at their destination.\n' +
        '\n' +
        "Upon arriving at the island, they found themselves amidst a mysterious temple, its entrance adorned with the same symbols as the original message. They knew they were on the right track. With adrenaline surging through their veins, they deciphered the next clue hidden within the temple's walls. Each step unveiled a new revelation, and they felt closer to uncovering the ultimate secret.\n" +
        '\n' +
        'Their journey led them to a dimly lit chamber at the heart of the temple. There, they found an ancient artifact with yet another encoded message, seemingly the final piece of the puzzle. Max and Leo worked together with newfound zeal, their bond as friends stronger than ever before. As the last symbols fell into place, the artifact began to emit a soft, ethereal glow.\n' +
        '\n' +
        "The final message revealed a profound truth about the interconnectedness of all life forms and the significance of every individual's actions. It spoke of a great responsibility that rested upon the discoverers of this message – the responsibility to protect and preserve the delicate balance of the world.\n" +
        '\n' +
        "With newfound knowledge, they returned to the city, transformed by their extraordinary journey. Max's coding skills and Leo's artistic insights found a newfound purpose in making the world a better place. They collaborated to create a revolutionary app that connected people worldwide, fostering understanding and encouraging positive actions towards the environment and society.\n" +
        '\n' +
        'Their story spread like wildfire, inspiring countless others to join the cause. As they looked back at their journey, they knew that the real message lay not in the codes they cracked, but in the realization that together, they could change the world – one message of hope and unity at a time. And so, their extraordinary adventure continued, fueled by the power of friendship, and the desire to make a difference, one message at a time.',
      wordCount: 719,
      status: 'IN_REVIEW',
      isMarked: true,
      dateTextUpdated: '2023-08-02T06:50:31.439829',
      dateSubmitted: '2023-08-02T06:51:35.248028',
      dateMarked: '2023-08-02T06:51:55.838997'
    }
  */
  // get the marks for the essay
  const essayMarks = await getEssayMark(essayId);
  logger.debug("essayMarks", essayMarks);
  /*
    essayMarks is like this:
      {
        version: '0.1.0',
        taskType: 'NARRATIVE',
        essayMarkId: 'ed4ecd30-7e91-4c86-b9d7-36f6afa9d8a7',
        activityId: '6b1b2525-9f03-4e81-a93f-38f16754cbbd',
        classroomId: '7e37a9c1-fb37-4339-9a8d-f0c1fe8acde4',
        schoolId: 'e2eee82c-38bc-4af6-a3b8-478251abb63b',
        essayId: '8b57b0bf-019e-4ded-a144-f1e690e7417e',
        studentId: '35e56407-5bc5-4d42-b30f-c706fdce1ba1',
        mark: {
          audience: {
            rubricCategory: 'Audience',
            score: 5,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          textStructure: {
            rubricCategory: 'Text structure',
            score: 4,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          ideas: {
            rubricCategory: 'Ideas',
            score: 5,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          characterSetting: {
            rubricCategory: 'Character and setting',
            score: 4,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          vocabulary: {
            rubricCategory: 'Vocabulary',
            score: 4,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          cohesion: {
            rubricCategory: 'Cohesion',
            score: 4,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          paragraphing: {
            rubricCategory: 'Paragraphing',
            score: 2,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          sentenceStructure: {
            rubricCategory: 'Sentence structure',
            score: 5,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          punctuation: {
            rubricCategory: 'Punctuation',
            score: 4,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          },
          spelling: {
            rubricCategory: 'Spelling',
            score: 5,
            scorerId: 'Narrative scorer version 1',
            comment: '{"text": "default_text"}'
          }
        },
        totalScore: 42,
        teacherComment: '',
        errorMessage: '',
        history: null,
        isReviewed: false
      }
    */
  if (!essayMarks) {
    throw new Error("Could not get marks for essay ", essayId);
  }
  // // we want to process this via chatgpt
  // await processChatGpt(
  //   essayMarks,
  //   essay,
  //   prompt,
  //   chatGptResponse,
  //   setChatGptResponse,
  //   dispatch,
  //   setTabIndex
  // );
  // get the prompt for the activity
  const prompt = await getActivityPromptByActivityID(essay.activityId);
  logger.debug("prompt", prompt);
  /*
    prompt is like this:
    {
      id: '9faee515-51aa-4875-b223-6d21a1b03b09',
      image: null,
      promptName: 'The Message',
      stimulus: '<p>.....</p>',
      text: '<h1 id="isPasted"><strong>The message</strong></h1><p>Write a narrative (story) using ...</p>',
      isRichText: true
    }
    */
  if (!prompt) {
    throw new Error("Could not get prompt for activity ", essay.activityId);
  }
  logger.debug("Getting chatGPT response; this can take over a minute...");
  // get chatGPT output
  const chatGptResponse = await processChatGpt(essayMarks, essay, prompt);

  logger.debug("chatGptResponse", chatGptResponse);
  /*
    chatGptResponse is like this:
    {
      audience: "Your essay...",
      'character-and-setting': "Your characters and settings ...",
      cohesion: 'Your essay ...',
      ideas: 'The ideas in your essay ...',
      paragraphing: 'Your paragraphing ...',
      punctuation: 'Your punctuation ...',
      'sentence-structure': "Your sentence structure ...",
      spelling: "Most of your spelling ...",
      'text-structure': 'The structure of your text ...',
      vocabulary: 'You exhibit good use of vocabulary, ...'
    }
    */
  // Update the DB with the chatGptResponse
  // const insertResult = await insertContextualFeedbackStudentEssay(
  //   chatGptResponse,
  //   essayMarks
  // );
  // logger.debug("insertContextualFeedbackStudentEssay", insertResult);
};

module.exports = { processSubmittedEssayRecord };
