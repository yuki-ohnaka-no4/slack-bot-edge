import { SlackAPIClient } from "slack-web-api-client";

import type { Env } from "~/@types/app";
import { greet } from "~/features";

const handler: ExportedHandler<Env> = {
  fetch: (request: Request, env: Env, _context: ExecutionContext): Response | Promise<Response> => {
    const client = new SlackAPIClient(env.SLACK_BOT_TOKEN, {
      logLevel: env.SLACK_LOGGING_LEVEL,
    });
    return greet.end.batch.fetch(client, request, env);
  },
  scheduled: (
    _controller: ScheduledController,
    env: Env,
    _context: ExecutionContext
  ): Promise<void> => {
    const client = new SlackAPIClient(env.SLACK_BOT_TOKEN, {
      logLevel: env.SLACK_LOGGING_LEVEL,
    });
    return greet.end.batch.scheduled(client, env);
  },
};

export default handler;
