import { SlackApp } from "slack-cloudflare-workers";

import type { Env } from "~/@types/app";
import { greet } from "~/features";

import type { SlackMiddlwareRequest, SlackResponse } from "slack-cloudflare-workers";

const handler: ExportedHandler<Env> = {
  fetch: (request: Request, env: Env, context: ExecutionContext): Response | Promise<Response> => {
    const slackApp = new SlackApp<Env>({ env })
      .use(
        async (
          req: SlackMiddlwareRequest<Env>
          // eslint-disable-next-line @typescript-eslint/require-await
        ): Promise<SlackResponse | void> => {
          req.context.custom["context"] = context;
          req.context.custom["env"] = env;
        }
      )
      .event(greet.start.event.reaction.added.name, greet.start.event.reaction.added.handler)
      .event(greet.start.event.reaction.removed.name, greet.start.event.reaction.removed.handler);

    return slackApp.run(request, context);
  },
};

export default handler;
