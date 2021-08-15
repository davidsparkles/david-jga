import crypto = require("crypto");
import httpStatus = require("http-status");
import { ParameterizedContext } from "koa";
import webpush = require("web-push");
import { getClient } from "./getClient";

const vapidKeys = {
  publicKey: "BDTxsv_QJLLjMkKfKrZw9kLADmciH2_E1B4Smkp9kbOLHWlrNs_3jFZA3zCyYbw9GRKq5hoEhkcHiBMf8OiGKDQ",
  privateKey: process.env.PRIVATE_VAPID_KEY
};

webpush.setVapidDetails("mailto:david.sparkles@posteo.de", vapidKeys.publicKey, vapidKeys.privateKey);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

export async function handleSubscribe(ctx: ParameterizedContext, next) {
  console.log("handleSubscribe");
  const subscriptionRequest: webpush.PushSubscription = (ctx.request as any).body as any;
  const subscriptionId = await subscribe(subscriptionRequest);
  ctx.response.status = httpStatus.CREATED;
  ctx.body = { id: subscriptionId };
  next();
}

async function subscribe(pushSubscription: webpush.PushSubscription): Promise<string> {
  const subscriptionId = createHash(JSON.stringify(pushSubscription));
  const client = await getClient();
  await client.query(`
    INSERT INTO push_subscription(id, push_subscription_payload)
    VALUES ($1, $2)
    ON CONFLICT ON CONSTRAINT push_subscription_pkey
    DO UPDATE SET updated_at = now(), unsubscribed_at = NULL WHERE push_subscription.id = $1;
  `, [subscriptionId, JSON.stringify(pushSubscription)]);
  console.log("New subscription: ", subscriptionId);
  client.release();
  return subscriptionId;
}

export async function handleUnsubscribe(ctx: ParameterizedContext, next) {
  try {
    const subscriptionId = ctx.params.id;
    await unsubscribe(subscriptionId);
    ctx.response.status = httpStatus.ACCEPTED;
  } catch (err) {
    console.log("error unsubscribing", JSON.stringify(err));
    ctx.response.status = httpStatus.INTERNAL_SERVER_ERROR;
  } finally {
    next();
  }
}

async function unsubscribe(subscriptionId: string): Promise<string> {
  const client = await getClient();
  await client.query("UPDATE push_subscription SET unsubscribed_at = now() WHERE id = $1;", [subscriptionId]);
  console.log("Unsubscribed: ", subscriptionId);
  client.release();
  return subscriptionId;
}

async function getPushSubscriptions(): Promise<Array<{ id: string; pushSubscription: webpush.PushSubscription }>> {
  const client = await getClient();
  const result = (await client.query(`
    SELECT id, push_subscription_payload AS "pushSubscription"
    FROM push_subscription
    WHERE unsubscribed_at IS NULL;
  `, []))?.rows;
  client.release();
  return result;
}

interface PushPayload {
  title: string;
  text: string;
  url: string;
}

export async function handleSendPushNotification(ctx: ParameterizedContext, next) {
  console.log("handleSendPushNotification");
  const payload = ctx.request?.body as any as PushPayload;
  if (payload != null) {
    const pushSubscriptions = await getPushSubscriptions();
  
    console.log(`Send push to ${pushSubscriptions.length} subscriptions.`);
    for (const sub of pushSubscriptions) {
      try {
        const res = await sendPushNotification(sub.pushSubscription, payload);
        console.log(`Success for ${sub.id}: ${res}`)
      } catch (err) {
        console.log(`Error for ${sub.id}: ${err.statusCode}, ${err}`)
        if (err.statusCode === httpStatus.GONE) {
          console.log(`Subscription ${sub.id} is gone and will be unsubscribed.`);
          await unsubscribe(sub.id);
        }
      }
    }
  }

  ctx.response.body = {};
  ctx.response.status = httpStatus.ACCEPTED;
  next();
}

async function sendPushNotification(pushSubscription: webpush.PushSubscription, payload: PushPayload): Promise<webpush.SendResult> {
  return webpush.sendNotification(
    pushSubscription,
    JSON.stringify({
      // image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
      tag: "new-level",
      ...payload
    })
  );
}

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));
