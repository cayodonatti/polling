import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import filter from "content-filter";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import responses from "./status";
import { loginRouter, testRouter, pollRouter } from "./routes";

const app = express();
app.use(cors());

dotenv.config(); // loading env vars

// Setting up JSON parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// Prevents mongoose query injection
app.use(
  filter({
    dispatchToErrorHandler: true,
    appendFound: true
  })
);
// Default rror handling
app.use(function(err, req, res, next) {
  responses.error(res, err, err.status);
});

const router = express.Router();
testRouter(router);
loginRouter(router);
pollRouter(router);

app.use("/api", router);

// If production, serve react static files
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    console.log(path.join(__dirname, "../client/build", "index.html"));
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

// Setup MongoDB connection
const { MONGO_USER, MONGO_PASS, MONGO_SERVER } = process.env;
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_SERVER}/${MONGO_USER}`,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  },
  function(err, res) {
    if (err) {
      console.log("ERROR connecting to: " + MONGO_SERVER + ". " + err);
    } else {
      console.log("Successfully connected to: " + MONGO_SERVER);
    }
  }
);

const port = process.env.API_PORT || 21272;
app.listen(port, () => {
  console.log("Server started!");
});
