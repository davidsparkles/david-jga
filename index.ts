import Koa from "koa";
import BodyParser = require("koa-bodyparser");
import cors = require("koa-cors");
import Logger = require("koa-logger");
import mount = require("koa-mount");
import Router = require("koa-router");
import serve = require("koa-static");
import HttpStatus = require("http-status");
import { getClient} from "./src/getClient";

import dotenv = require('dotenv');
dotenv.config();

const app = new Koa();

const REACT_ROUTER_PATHS = ["/game"];

const static_pages = new Koa();
static_pages.use(serve(__dirname + "/frontend/build")); //serve the build directory
app.use(async (ctx, next) => {
  if (REACT_ROUTER_PATHS.find(path => ctx.request.path.startsWith(path)) != null) {
    ctx.request.path = '/';
  }
  await next();
}).use(mount("/", static_pages));

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const router = new Router();



router.get("/api/game/:gameId", async (ctx, next)=>{
  const gameId = ctx.params.gameId;

  const client = await getClient();
  const res = await client.query(`
    SELECT row_to_json(d) AS data FROM (
      SELECT
        game.id AS "gameId",
        game.title AS "gameTitle",
        challenges.count AS "totalChallenges",
        closed.count AS "totalClosed",
        COALESCE((
          SELECT sum(points) FROM exec_challenge WHERE game_id = game.id
        ), 0) AS "totalReachedPoints",
        COALESCE((
          SELECT sum(points) FROM challenge
        ), 0) AS "totalMaxPoints",
        COALESCE((
          SELECT json_agg(row_to_json(sub)) FROM (
            SELECT
              id,
              CASE WHEN min_closed <= closed.count THEN title ELSE NULL END AS title,
              CASE WHEN min_closed <= closed.count THEN description ELSE NULL END AS description,
              challenge.points AS "maxPoints",
              COALESCE(ec.points, 0) AS "reachedPoints",
              min_closed AS "minClosed",
              CASE
                WHEN min_closed > closed.count THEN 'hidden'
                WHEN ec IS NOT NULL THEN 'closed'
                ELSE 'open'
              END AS state
            FROM challenge
              LEFT JOIN exec_challenge ec ON ec.challenge_id = challenge.id AND ec.game_id = game.id
          ) sub
        ), '[]'::json) AS challenges
      FROM game,
        LATERAL (SELECT COALESCE((SELECT count(*) FROM exec_challenge WHERE game_id = game.id), 0) count) closed,
        LATERAL (SELECT COALESCE((SELECT count(*) FROM challenge), 0) count) challenges
      WHERE game.id = $1
    ) d;
  `, [gameId]);

  const data = res?.rows?.[0]?.data;
  if (data != null) {
    ctx.status = HttpStatus.OK;
    ctx.body = data;
  } else {
    ctx.status = HttpStatus.NOT_FOUND;
    ctx.body = `Game <${gameId}> Not Found`;
  }
  await next();
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(PORT, async () => {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});
