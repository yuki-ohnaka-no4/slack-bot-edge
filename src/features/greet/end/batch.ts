import type { Env } from "~/@types/app";
import { isBusinessHoliday } from "~/apis/sheet";

import { toTitle, toBlocks } from "./module";

import type { SlackAPIClient } from "slack-cloudflare-workers";

// ---

export const handler = async (client: SlackAPIClient, env: Env): Promise<void> => {
  console.info("handler");
  const channel = env.GREET_CHANNEL_ID;

  if (!channel) {
    throw new Error("Invalid Params.");
  }

  const date = new Date(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));

  console.log(date);

  if (await isBusinessHoliday(env, date)) {
    return;
  }

  const response = await client.chat.postMessage({
    channel,
    text: toTitle(date),
    blocks: toBlocks(date),
    unfurl_links: false,
    unfurl_media: false,
  });

  if (!response.ok) {
    console.error(response.errors);
  }
};

// ---

export const fetch = async (
  client: SlackAPIClient,
  request: Request,
  env: Env
): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("It's works");
  }

  await handler(client, env);
  return new Response("success");
};

// ---

export const scheduled = handler;
