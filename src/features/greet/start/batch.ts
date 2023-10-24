import { toTitle, toBlocks, toReactionRecords } from "./module";
import type { Env } from "~/@types/app";
import type { SlackAPIClient } from "slack-cloudflare-workers";
import { isBusinessHoliday } from "~/apis/sheet";

// ---

const handler = async (
  client: SlackAPIClient,
  env: Env,
  context: ExecutionContext
): Promise<void> => {
  console.info("handler");
  const channel = env.GREET_CHANNEL_ID;

  if (!channel) {
    throw new Error("Invalid Params.");
  }

  const date = new Date();

  if (await isBusinessHoliday(env, date)) {
    return;
  }

  const response = await client.chat.postMessage({
    channel,
    text: toTitle(date),
    blocks: toBlocks(
      toTitle(date),
      await toReactionRecords(env, context, client, date)
    ),
  });

  if (!response.ok) {
    console.error(response.errors);
  }
};

// ---

export const fetch = async (
  client: SlackAPIClient,
  request: Request,
  env: Env,
  context: ExecutionContext
): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("It's works");
  }
  await handler(client, env, context);
  return new Response("success");
};

// ---

export const scheduled = handler;
