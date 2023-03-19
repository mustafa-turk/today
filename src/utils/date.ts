export const getDayDigits = () => {
  const date = new Date();
  const day = date.toLocaleString("default", { day: "2-digit" });
  return day;
};

export const getMonth = () => {
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  return month;
};

export const getStartAndEndOfToday = () => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date();
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

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
