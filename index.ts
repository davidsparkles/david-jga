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
        game_level.current_level AS "currentLevel",
        game_level.current_xp AS "currentXp",
        COALESCE((
          SELECT required_xp - game_level.current_xp FROM level WHERE level.id = game_level.current_level + 1
        ), 0) AS "xpToNextLevel",
        COALESCE((
          SELECT game_level.current_xp - required_xp FROM level WHERE level.id = game_level.current_level
        ), 0) AS "xpWithinCurrentLevel",
        COALESCE((
          SELECT max(id) FROM level
        ), 0) AS "maxLevel",
        COALESCE((
          SELECT json_agg(row_to_json(sub)) FROM (
            SELECT
              id,
              disabled,
              CASE WHEN min_level <= game_level.current_level THEN title ELSE NULL END AS title,
              CASE WHEN min_level <= game_level.current_level THEN description ELSE NULL END AS description,
              quest.xp AS "maxXp",
              COALESCE(ec.xp, 0) AS "reachedXp",
              min_level AS "minLevel",
              CASE
                WHEN min_level > game_level.current_level THEN 'hidden'
                WHEN ec IS NOT NULL THEN 'closed'
                ELSE 'open'
              END AS state
            FROM quest
              LEFT JOIN exec_quest ec ON ec.quest_id = quest.id AND ec.game_id = game.id
          ) sub
        ), '[]'::json) AS quests
      FROM game,
        LATERAL (SELECT * FROM game_level WHERE game_id = game.id) game_level
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
