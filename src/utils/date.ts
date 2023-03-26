import moment from "moment";

export const getDay = (date: Date) => {
  const day = moment(date).format("dddd");
  return day;
};

export const getDayDigits = (date: Date) => {
  const day = date.toLocaleString("default", { day: "2-digit" });
  return day;
};

export const getMonth = (date: Date) => {
  const month = date.toLocaleString("default", { month: "long" });
  return month;
};

export const getStartAndEndOfDay = (date: Date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
};

export const getTimeFromString = (date: string | Date) => {
  const hours = addZero(new Date(date).getHours());
  const minutes = addZero(new Date(date).getMinutes());

  return `${hours}:${minutes}`;
};

export const timeBetweenDates = (
  startTime: string | Date,
  endTime: string | Date
) => {
  const difference =
    new Date(endTime).getTime() - new Date(startTime).getTime();

  return Math.round(difference / 60000);
};

export const getDayPlusHours = (date: Date, hours: number) => {
  const today = new Date(date);
  today.setHours(today.getHours() + hours);
  return today;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
