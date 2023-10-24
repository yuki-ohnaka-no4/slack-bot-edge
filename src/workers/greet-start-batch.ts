import { greet } from "~/features";
import type { Env } from "~/@types/app";
import { SlackAPIClient } from "slack-web-api-client";

const handler: ExportedHandler<Env> = {
  fetch: (
    request: Request,
    env: Env,
    context: ExecutionContext
  ): Response | Promise<Response> => {
    const client = new SlackAPIClient(env.SLACK_BOT_TOKEN, {
      logLevel: env.SLACK_LOGGING_LEVEL,
    });
    return greet.start.batch.fetch(client, request, env, context);
  },
  scheduled: (
    controller: ScheduledController,
    env: Env,
    context: ExecutionContext
  ): void | Promise<void> => {
    const client = new SlackAPIClient(env.SLACK_BOT_TOKEN, {
      logLevel: env.SLACK_LOGGING_LEVEL,
    });
    return greet.start.batch.scheduled(client, env, context);
  },
};

export default handler;
