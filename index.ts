import dotenv = require('dotenv');
dotenv.config();

process.on("unhandledRejection", (reason, p) => {
  console.warn("Unhandled Rejection at: Promise", p, "reason:", reason);
});

import Koa from "koa";
import BodyParser = require("koa-bodyparser");
import cors = require("koa-cors");
import Logger = require("koa-logger");
import mount = require("koa-mount");
import Router = require("koa-router");
import serve = require("koa-static");
import * as crud from "./src/crud";
import * as pushSubscription from "./src/subscriptionHandler";


const app = new Koa();

const REACT_ROUTER_PATHS = ["/quests", "/rewards", "/levels", "/settings"];

const static_pages = new Koa();
static_pages.use(serve(__dirname + "/frontend/build")); //serve the build directory
app.use(async (ctx, next) => {
  if (REACT_ROUTER_PATHS.find(path => ctx.request.path.startsWith(path)) != null) {
    ctx.request.path = '/';
  }
  await next();
}).use(mount("/", static_pages));

const PORT = process.env.PORT || 80;

app.use(BodyParser({
  extendTypes: {
    json: ["text/plain"]
  }
}));
app.use(Logger());
app.use(cors());

const router = new Router();

router.get("/api/data", crud.getData);
router.post("/api/quest", crud.updateQuest);
router.post("/api/levels", crud.updateLevels);

router.post("/api/subscription", pushSubscription.handleSubscribe);
router.get("/api/subscription", pushSubscription.handleSendPushNotification);
router.delete("/api/subscription/:id", pushSubscription.handleUnsubscribe);

app.use(router.routes()).use(router.allowedMethods());


app.listen(PORT, async () => {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});
