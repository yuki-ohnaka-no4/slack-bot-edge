import { utcToZonedTime } from "date-fns-tz";

import type { Env } from "~/@types/app";
import { fetchReactions } from "~/apis/slack";

import { toBlocks, toReactionRecords, toTitle, trigger } from "./module";

import type { EventRequest } from "slack-cloudflare-workers";

// ---

const reactionEventHandler = async (
  req: EventRequest<Env, typeof reactionAddedName | typeof reactionRemovedName>
): Promise<void> => {
  console.info("reactionEventHandler");
  const {
    item: { channel, ts },
    item_user: itemUser,
  } = req.payload;

  if (itemUser !== req.context.botUserId) {
    return;
  }

  const response = await fetchReactions(
    req.context.custom["context"] as ExecutionContext,
    req.context.client,
    req.payload
  );

  if (!response.message) {
    return;
  }

  if (!response.message.text?.startsWith(trigger)) {
    console.log("ignore response.message.text", response.message.text);
    return;
  }

  const date = utcToZonedTime(new Date(Number(ts) * 1000), "Asia/Tokyo");

  console.log(date);

  const reactions = await toReactionRecords(
    req.context.custom["env"] as Env,
    req.context.custom["context"] as ExecutionContext,
    req.context.client,
    date,
    response.message?.reactions ?? []
  );

  await req.context.client.chat.update({
    channel,
    ts,
    text: toTitle(date),
    blocks: toBlocks(toTitle(date), reactions),
  });
};

// ---

const reactionAddedName = "reaction_added" as const;

const reactionAddedEventHandler: (
  req: EventRequest<Env, typeof reactionAddedName>
) => Promise<void> = reactionEventHandler;

// ---

const reactionRemovedName = "reaction_removed" as const;

const reactionRemovedHandler: (
  req: EventRequest<Env, typeof reactionRemovedName>
) => Promise<void> = reactionEventHandler;

// ---

export const reaction = {
  added: {
    name: reactionAddedName,
    handler: reactionAddedEventHandler,
  },
  removed: {
    name: reactionRemovedName,
    handler: reactionRemovedHandler,
  },
};
