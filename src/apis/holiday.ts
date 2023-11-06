import { format } from "date-fns";
import { z } from "zod";
import { ja } from "date-fns/locale";

// ---

const HolidaysSchema = z.record(z.string());

type Holidays = z.infer<typeof HolidaysSchema>;

// ---

const fetchHolidays = async (year: number | string): Promise<Holidays> => {
  return HolidaysSchema.parse(
    await (
      await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`)
    ).json()
  );
};

// ---

export const isHoliday = async (date: Date): Promise<boolean> => {
  const holidays = await fetchHolidays(date.getFullYear());
  return Object.keys(holidays).includes(
    format(date, `yyyy-MM-dd`, {
      locale: ja,
    })
  );
};
