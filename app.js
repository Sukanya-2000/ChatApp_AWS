const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "*",
//   })
// );

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Router
const userRouter = require("./router/user");
const homePageRouter = require("./router/homePage");
const chatRouter = require("./router/chat");
const groupRouter = require("./router/group");

//Models
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const UserGroup = require("./models/userGroup");

//Relationships between Tables
User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });

Chat.belongsTo(User);
Chat.belongsTo(Group);

User.hasMany(UserGroup);

Group.hasMany(Chat);
Group.hasMany(UserGroup);

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

//Middleware
app.use("/", userRouter);
app.use("/user", userRouter);

app.use("/homePage", homePageRouter);

app.use("/chat", chatRouter);

app.use("/group", groupRouter);

const job = require("./jobs/cron");
job.start();

sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => console.log(err));