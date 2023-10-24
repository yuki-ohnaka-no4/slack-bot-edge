import type { SlackEdgeAppEnv } from "slack-cloudflare-workers";
import type { Env as SheetEnv } from "~/apis/sheet";

export type Env = SlackEdgeAppEnv &
  SheetEnv & {
    GREET_CHANNEL_ID: string;
  };
