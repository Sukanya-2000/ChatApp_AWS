// Importing the CronJob class from the cron library
const CronJob = require("cron").CronJob;

// Importing necessary modules and models
const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const Chat = require("../models/chat");
const ArchivedChat = require("../models/archieveChatModel");

// Creating a new CronJob that runs at midnight every day
const job = new CronJob("0 0 * * *", function () {
  // Runs at midnight every day

  // Calculating the date and time 1 day ago from now
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

  // Finding all Chat entries created before yesterday
  Chat.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.lt]: yesterday,
      },
    },
  }).then((chats) => {
    // Using bulkCreate to insert all retrieved chats into ArchivedChat model
    ArchivedChat.bulkCreate(chats).then(() => {
      // Deleting all Chat entries created before yesterday
      Chat.destroy({
        where: {
          createdAt: {
            [Sequelize.Op.lt]: yesterday,
          },
        },
      });
    });
  });
});

// Exporting the CronJob for usage in other files
module.exports = job;
