module.exports.listActivitys = /* GraphQL */ `
  query listActivitys($filter: ModelActivityFilterInput!, $nextToken: String) {
    listActivitys(filter: $filter, nextToken: $nextToken) {
      items {
        id
        classroomID
        prompt {
          promptName
          taskType
          text
          stimulus
        }
        creatorEmail
        user {
          userId
          firstName
          lastName
          email
        }
        classroom {
          className
          yearLevels {
            items {
              yearLevel {
                id
                description
              }
              id
            }
          }
        }
        createdAt
      }
      nextToken
    }
  }
`;

module.exports.getActivityPrompt = /* GraphQL */ `
  query getActivity($id: ID!) {
    getActivity(id: $id) {
      prompt {
        id
        image {
          bucket
          key
          region
        }
        promptName
        stimulus
        text
        isRichText
      }
    }
  }
`;

module.exports.getContextualFeedbackByEssayID = /* GraphQL */ `
  query GetContextualFeedbackByEssayID($essayID: String!) {
    getContextualFeedbackByEssayID(
      essayID: $essayID
    ) {
      items {
        activityID
        createdAt
        essayID
        id
        studentID
        updatedAt
      }
    }
  }
`;

module.exports.getSystemParameter =
  /* GraphQL */
  `
    query GetSystemParameter($key: String!) {
      getSystemParameter(key: $key) {
        id
        key
        paramData
        createdAt
        updatedAt
      }
    }
  `;

module.exports.getRubricByTaskTypeGQL = /* GraphQL */ `
  query GetRubricByTaskType($taskType: TaskType, $limit: Int) {
    getRubricByTaskType(taskType: $taskType, limit: $limit) {
      items {
        id
        maxScore
        rubricName
      }
    }
  }
`;

module.exports.listRubrics = /* GraphQL */ `
  query ListRubrics(
    $filter: ModelRubricFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRubrics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskType
        rubricName
        description
        maxScore
        progressComments {
          nextToken
        }
        benchmarks {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
