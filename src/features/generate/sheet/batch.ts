import { format } from "date-fns";

import type { Env } from "~/@types/app";
import { fetchAccessToken, duplicateSheet, writeValueToCell, fetchAllSheets } from "~/apis/sheet";

export const handler = async (env: Env): Promise<void> => {
  console.info("handler");
  const date = new Date(new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
  console.log(date);

  try {
    const accessToken = await fetchAccessToken(env);

    // 翌月の1日目
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);

    const templateSheetId = 1903348701;

    const nextMonthSheetName = format(date, "yyyy/M");

    const sheets = await fetchAllSheets(env);
    const isNextMonthSheetExists = sheets.some(
      (sheet) => sheet.properties.title === nextMonthSheetName
    );

    if (!isNextMonthSheetExists) {
      await duplicateSheet(
        env,
        accessToken,
        templateSheetId,
        nextMonthSheetName
      );
    }

    const range = "A4";
    const firstOfMonth = format(date, "yyyy/MM/dd");
    const values = [firstOfMonth];

    await writeValueToCell(env, accessToken, nextMonthSheetName, range, values);
  } catch (e) {
    console.error(e);
  }
};

export const fetch = async (env: Env, request: Request): Promise<Response> => {
  if (request.method !== "POST") {
    return new Response("It's works");
  }

  await handler(env);
  return new Response("success");
};

export const scheduled = handler;
