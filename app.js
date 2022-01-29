const express = require("express");
const mongoose = require("mongoose");
const chalk = require("chalk");
const Task = require("./models/task");
const app = express();

const dbURI =
  "mongodb+srv://temp_user:temp_1234@tasks.pcvnz.mongodb.net/Database1?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log(chalk.bgGreen.bold.white("\nConnected to Database !!\n"))
  )
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));

app.use(async (req, res, next) => {
  console.log(chalk.bgBlueBright.bold.white("Tasks"));
  res.setHeader("Content-Type", "text/plain");
  res.write("Tasks\n\n");
  for (let i = 1; i < 5; i++) {
    let x = i;
    let task = new Task({
      Description: `Task ${x}`,
      Completed: Math.floor(Math.random() * 11) % 2 == 0 ? false : true,
    });
    await task
      .save()
      .then((result) => {
        console.log(`Description : ${result.Description}`);
        console.log(`Completed : ${result.Completed}`);
        console.log("\n");

        res.write(`Description : ${result.Description}\n`);
        res.write(`Completed : ${result.Completed}\n\n`);
      })
      .catch((err) => console.log(err));
  }
  next();
});

app.use(async (req, res, next) => {
  console.log(
    chalk.bgMagentaBright.bold.white("Tasks which are not completed !!")
  );
  res.write("Tasks which are not completed !!\n\n");
  await Task.find()
    .then((result) => {
      result.forEach((data) => {
        if (data.Completed == false) {
          console.log(`Description : ${data.Description}`);
          console.log(`Completed : ${data.Completed}`);
          console.log("\n");

          res.write(`Description : ${data.Description}\n`);
          res.write(`Completed : ${data.Completed}\n\n`);
        }
      });
    })
    .catch((err) => console.log(err));
  next();
});

app.use(async (req, res, next) => {
  console.log(chalk.bgGreenBright.bold.white("Tasks Updated !!"));
  res.write("Tasks Updated !!\n\n");
  await Task.find()
    .then((result) => {
      result.forEach((data) => {
        if (data.Completed == false) {
          data.Completed = true;
          data
            .save()
            .then((result) => {
              console.log(`Description : ${result.Description}`);
              console.log(`Completed : ${result.Completed}`);
              console.log("\n");

              res.write(`Description : ${result.Description}\n`);
              res.write(`Completed : ${result.Completed}\n\n`);
            })
            .catch((err) => console.log(err));
        }
      });
    })
    .then(() => {
      next();
    })
    .catch((err) => console.log(err));
});

app.use(async (req, res) => {
  await Task.find()
    .then((result) => {
      let index = Math.floor(Math.random() * result.length);
      let id = result[index]._id;
      Task.findByIdAndDelete(id)
        .then(() => {
          console.log(
            chalk.bgRedBright.bold.white("Deleting a Task using ID !!")
          );
          console.log(`ID : ${id}`);
          console.log(`Description : ${result[index].Description}`);
          console.log(`Completed : ${result[index].Completed}`);
          console.log(chalk.bgRed.bold.white("Task Deleted !!\n\n"));

          res.write("Deleting a Task using ID !!\n\n");
          res.write(`ID : ${id}\n`);
          res.write(`Description : ${result[index].Description}\n`);
          res.write(`Completed : ${result[index].Completed}\n\n`);
          res.write("Task Deleted !!\n");
          res.end();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
