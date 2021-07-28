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

const REACT_ROUTER_PATHS = ["/game", "/fitti", "/broiler"];

const static_pages = new Koa();
static_pages.use(serve(__dirname + "/frontend/build")); //serve the build directory
app.use(async (ctx, next) => {
  if (REACT_ROUTER_PATHS.find(path => ctx.request.path.startsWith(path)) != null) {
    ctx.request.path = '/';
  }
  await next();
}).use(mount("/", static_pages));

const PORT = process.env.PORT || 3000;

app.use(BodyParser({
  extendTypes: {
    json: ["text/plain"]
  }
}));
app.use(Logger());
app.use(cors());

const router = new Router();



router.get("/api/data", async (ctx, next)=>{

  const client = await getClient();
  const res = await client.query(`
    SELECT row_to_json(d) AS data FROM (
      SELECT
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
              archived,
              title,
              description,
              quest.max_xp AS "maxXp",
              quest.xp,
              min_level AS "minLevel",
              CASE
              WHEN min_level > game_level.current_level THEN 'hidden'
              WHEN quest.xp IS NOT NULL THEN 'closed'
              ELSE 'open'
              END AS state,
              COALESCE ((
                SELECT json_agg(row_to_json(sub_version)) FROM (
                  SELECT * FROM quest_version WHERE quest_version.quest_id = quest.id ORDER BY created_at DESC
                ) AS sub_version
              ), '[]'::json) AS versions
            FROM quest
            ORDER BY quest.min_level ASC, quest.title ASC
            ) sub
        ), '[]'::json) AS quests,
        COALESCE((
          SELECT json_agg(row_to_json(sub_level)) FROM (
            SELECT
              id,
              required_xp AS "requiredXp"
            FROM level
            ORDER BY id ASC
            ) sub_level
        ), '[]'::json) AS levels
      FROM (
        SELECT max(level.id) AS current_level, COALESCE(xps.sum, 0) AS current_xp
        FROM level
			    LEFT JOIN LATERAL (SELECT sum(COALESCE(xp, 0)) FROM quest) xps ON TRUE
        WHERE COALESCE(xps.sum, 0) >= level.required_xp
        GROUP BY COALESCE(xps.sum, 0)
      ) game_level
    ) d;
  `, []);

  const data = res?.rows?.[0]?.data;
  if (data != null) {
    ctx.status = HttpStatus.OK;
    ctx.body = data;
  } else {
    ctx.status = HttpStatus.NOT_FOUND;
    ctx.body = `Data Not Found`;
  }
  await next();
});

router.post("/api/quest", async (ctx, next) => {
  const values = ctx.request.body as any;
  console.log("Received values: ", JSON.stringify(values));

  const client = await getClient();
  if (values.delete === true) {
    await client.query(`DELETE FROM quest WHERE id = $1`, [values.id]);
    console.log(`Deleted quest ${values.id}`);
  } else if (values.id != null) {
    await client.query(
      `UPDATE quest SET title=$2, description=$3, max_xp = $4, min_level = $5, xp = $6, disabled = $7, archived = $8 WHERE id = $1;`,
      [values.id, values.title, values.description, values.maxXp, values.minLevel, values.xp, values.disabled, values.archived]
    );
    console.log(`Updated quest ${values.id}`);
  } else {
    await client.query(
      `INSERT INTO quest (title, description, max_xp, min_level, disabled, archived) VALUES ($1, $2, $3, $4, $5, $6);`,
      [values.title, values.description, values.maxXp, values.minLevel, values.disabled, values.archived]
    );
    console.log(`Created new quest ${values.title}`);
  }

  ctx.response.status = HttpStatus.CREATED;
  next();
});

router.post("/api/levels", async (ctx, next) => {
  const levels = ctx.request.body as any;
  console.log("Received values: ", JSON.stringify(levels));

  const client = await getClient();
  await client.query("DELETE FROM level;");
  for (const level of levels) {
    await client.query(
      `INSERT INTO level (id, required_xp) VALUES ($1, $2) ON CONFLICT ON CONSTRAINT level_pkey DO UPDATE SET required_xp = $2;`,
      [level.id, level.requiredXp]
    );
    console.log(`Level upserted ${level.id}`);
  }

  ctx.response.status = HttpStatus.CREATED;
  next();
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(PORT, async () => {
  console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});
