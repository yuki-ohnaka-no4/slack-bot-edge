import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { isHoliday } from "./holiday";

// ---

export type Env = {
  GOOGLE_SHEET_ID_WFO: string;
  GOOGLE_API_KEY: string;
};

export const fetchAllUsers = async (
  env: Env,
  date: Date
): Promise<string[]> => {
  return fetchUsers(env, date);
};

export const fetchWFOUsers = async (
  env: Env,
  date: Date
): Promise<string[]> => {
  return fetchUsers(env, date, ["◎", "○"]);
};

export const fetchLeaveUsers = async (
  env: Env,
  date: Date
): Promise<string[]> => {
  return fetchUsers(env, date, ["休"]);
};

export const fetchAMLeaveUsers = async (
  env: Env,
  date: Date
): Promise<string[]> => {
  return fetchUsers(env, date, ["AM休"]);
};

// ---

export const isBusinessHoliday = async (
  env: Env,
  date: Date
): Promise<boolean> => {
  if (await isHoliday(date)) {
    console.log("Holiday!");
    return true;
  }

  if ([0, 6].includes(utcToZonedTime(date, "Asia/Tokyo").getDay())) {
    // 土日
    console.log("Business Holiday!");
    return true;
  }

  // TODO: 全員休業

  return false;
};

// ---

const fetchUsers = async (
  env: Env,
  date: Date,
  targets: string[] = []
): Promise<string[]> => {
  const targetMonth = format(utcToZonedTime(date, "Asia/Tokyo"), "yyyy/M");

  const targetRow = utcToZonedTime(date, "Asia/Tokyo").getDate() + 3;

  const header = await fetchSheets(env, `${targetMonth}!G2:BA2`);

  const records = await fetchSheets(
    env,
    `${targetMonth}!G${targetRow}:BA${targetRow}`
  );

  const users = (header?.[0] ?? []).reduce<string[]>(
    (prev: string[], userId: string, index: number): string[] => {
      const item = String((records?.[0] ?? [])[index]);

      if (userId === undefined || userId.length === 0) {
        return prev;
      }

      if (item.trim() === "-") {
        return prev;
      }

      if (targets.length > 0) {
        if (!targets.includes(item.trim())) {
          return prev;
        }
      }

      return [...prev, userId];
    },
    []
  );

  return users;
};

// ---

const fetchSheets = async (env: Env, range: string): Promise<string[][]> => {
  const request = new Request(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      env.GOOGLE_SHEET_ID_WFO
    )}/values/${encodeURIComponent(range)}`
  );
  request.headers.append("x-goog-api-key", env.GOOGLE_API_KEY);

  const response = await fetch(request);

  const { values } = await response.json<{
    range: string;
    majorDimension: "string";
    values: string[][];
  }>();

  return values;
};
