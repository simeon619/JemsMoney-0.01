import {
  differenceInDays,
  differenceInHours,
  isToday,
  isYesterday,
} from "date-fns";
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";
import fr from "date-fns/locale/fr";

export const calculeDate = (times: any) => {
  let date_timestamp = new Date(times);
  let time = formatDistance(
    date_timestamp.setHours(date_timestamp.getHours() - 4),
    new Date(),
    {
      // addSuffix: true,

      includeSeconds: true,
      locale: fr,
    }
  );
  return time;
};

export const formatDate = (times: any) => {
  if (!times) return;

  const currentDate = new Date();
  const dateTimestamp = new Date(times);

  const hoursDiff = differenceInHours(currentDate, dateTimestamp);
  const daysDiff = differenceInDays(currentDate, dateTimestamp);
  if (hoursDiff < 24) {
    if (isToday(dateTimestamp)) {
      return format(dateTimestamp, "'Today, 'HH:mm");
    } else if (isYesterday(dateTimestamp)) {
      return format(dateTimestamp, "'Yerstaday, 'HH:mm");
    }
  } else if (daysDiff < 7) {
    return format(dateTimestamp, "eeee, HH:mm");
  } else {
    return format(dateTimestamp, "dd LLLL y, HH:mm");
  }
};
