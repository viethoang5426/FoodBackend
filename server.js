const { get } = require("config");
const express = require("express");
const crypto = require("crypto");
// require('dotenv').config();
const morgan = require("morgan");
const faviconMiddleware = require("./middlewares/faviconMiddleware");
const os = require("os");
const v8 = require("v8");
const cors = require("cors");
var session = require("express-session");

const app = express();
const port = 3000;

const apiRouter = require("./routes/api");
const orderRouter = require("./routes/order");





app.use(express.json());
app.set("view engine", "ejs");
app.use(faviconMiddleware);
app.use(morgan("dev"));
app.use(cors());

const secret = crypto.randomBytes(64).toString("hex");
app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/api", apiRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status | 1 | 500);
  if (req.originalUrl.indexOf("/api") == 0) {
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render("error");
  }
});

app.listen(port, () => {
  console.log(`server runing port ${port} `);
});

// console.log('Free memory:', os.freemem());
// console.log('Percentage of free memory:', ((os.freemem() / os.totalmem()) * 100).toFixed(2) + '%');
// console.log('total ram used:', process.memoryUsage().heapTotal);
// console.log('percentage of ram used:', ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 100).toFixed(2) + '%'));
// console.log('number of ports:', v8.getHeapStatistics().total_available_size);
