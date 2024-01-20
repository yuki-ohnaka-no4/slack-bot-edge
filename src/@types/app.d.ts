import type { Env as SheetEnv } from "~/apis/sheet";

import type { SlackEdgeAppEnv } from "slack-cloudflare-workers";

export type Env = SlackEdgeAppEnv &
  SheetEnv & {
    GREET_CHANNEL_ID: string;
    SLACK_BOT_KV: KVNamespace;
  };
