import Koa from "koa";

const app = new Koa();

app.use(async ctx => {
  ctx.body = "Hello World";
});

app.listen(process.env.PORT ?? 3010, undefined, () => console.log(`Listening on port ${process.env.PORT}`));
