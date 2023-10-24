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
    return greet.end.batch.fetch(client, request, env);
  },
  scheduled: (
    controller: ScheduledController,
    env: Env,
    context: ExecutionContext
  ): Promise<void> => {
    const client = new SlackAPIClient(env.SLACK_BOT_TOKEN, {
      logLevel: env.SLACK_LOGGING_LEVEL,
    });
    return greet.end.batch.scheduled(client, env);
  },
};

export default handler;
