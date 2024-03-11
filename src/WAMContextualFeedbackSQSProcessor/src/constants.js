const EssayStatus = {
  BLANK: "BLANK",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  SUBMITTED: "SUBMITTED",
  IN_REVIEW: "IN_REVIEW",
};

const EssayTextByStatus = {
  [EssayStatus.IN_PROGRESS]: "In Progress",
  [EssayStatus.SUBMITTED]: "Submitted",
  [EssayStatus.IN_REVIEW]: "In Review",
  [EssayStatus.COMPLETED]: "Completed",
  [EssayStatus.BLANK]: "Not Yet Opened",
};

module.exports = {
  EssayStatus,
  EssayTextByStatus,
};
