// Importing necessary modules and models
const path = require("path");
const User = require("../models/user");
const Chat = require("../models/chat");
const Group = require("../models/group");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

// Importing and setting up Socket.IO with specific configurations
const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Socket.IO event handler when a client connects
io.on("connection", (socket) => {
  // Event listener for "getMessages" emitted by the client
  socket.on("getMessages", async (groupName) => {
    try {
      // Retrieving group information based on the provided groupName
      const group = await Group.findOne({ where: { name: groupName } });

      // Retrieving messages associated with the group
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });

      // Logging that a request has been made
      console.log("Request Made");

      // Emitting the "messages" event to all connected clients with the retrieved messages
      io.emit("messages", messages);
    } catch (error) {
      // Logging any errors that occur during the process
      console.log(error);
    }
  });
});

// Exported function for sending messages
exports.sendMessage = async (req, res, next) => {
  try {
    // Retrieving group information based on the provided groupName
    const group = await Group.findOne({
      where: { name: req.body.groupName },
    });

    // Creating a new chat message associated with the user and group
    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.dataValues.id,
    });

    // Responding with a success message
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    // Logging any errors that occur during the process
    console.log(error);
    
    // Responding with an error message
    return res.status(400).json({ message: "Error" });
  }
};

// Exported function for retrieving messages
exports.getMessages = async (req, res, next) => {
  try {
    // Extracting query parameters from the request
    const param = req.query.param;

    // Retrieving group information based on the provided groupName
    const group = await Group.findOne({
      where: { name: req.query.groupName },
    });

    // Retrieving messages that meet specific criteria (using Sequelize's Op operators)
    const messages = await Chat.findAll({
      where: {
        [Op.and]: {
          id: {
            [Op.gt]: param,
          },
          groupId: group.dataValues.id,
        },
      },
    });

    // Responding with the retrieved messages
    return res.status(200).json({ messages: messages });
  } catch (error) {
    // Logging any errors that occur during the process
    console.log(error);
  }
};
