const sysType = "notify";
const read = false;
const notificationMessage =
  "The handwriting has been uploaded, please don't forget to check the logs.";
const sender = "admin@elastik.com";
const expiryDaysForNotification = 5;

module.exports = {
  sysType,
  read,
  sender,
  expiryDaysForNotification,
  notificationMessage,
};
