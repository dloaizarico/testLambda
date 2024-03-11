const createContextualFeedbackStudentEssay = /* GraphQL */ `
  mutation CreateContextualFeedbackStudentEssay(
    $input: CreateContextualFeedbackStudentEssayInput!
    $condition: ModelContextualFeedbackStudentEssayConditionInput
  ) {
    createContextualFeedbackStudentEssay(input: $input, condition: $condition) {
      activityID
      contextualInfo
      createdAt
      essayID
      id
      studentID
    }
  }
`;

module.exports = { createContextualFeedbackStudentEssay };
