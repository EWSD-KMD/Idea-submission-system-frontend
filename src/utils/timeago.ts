import { formatDistanceToNow } from "date-fns";

const timeAgo = (date: string) =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export default timeAgo;
