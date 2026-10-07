export function localDateInput(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function localTimeInput(iso: string) {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function combineLocalDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

export function scheduleDurationMinutes(
  date: string,
  startTime: string,
  endTime: string,
) {
  const start = combineLocalDateTime(date, startTime);
  const end = combineLocalDateTime(date, endTime);
  return (end.getTime() - start.getTime()) / 60000;
}

export function formatVisitRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], timeOptions)} – ${end.toLocaleTimeString([], timeOptions)}`;
}
