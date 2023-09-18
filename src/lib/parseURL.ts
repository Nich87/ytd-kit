export function parseVideoUrl(url: string): string | null {
    if(!(url.startsWith("https://") || url.startsWith("https://"))) url = "https://" + url;
  const parsed = new URL(url);

  const [, one, two] = parsed.pathname.split("/");
  if (parsed.hostname === "youtu.be") return one;

  const [com, youtube] = parsed.hostname.split(".").reverse();
  if (com !== "com" || youtube !== "youtube") return null;

  switch (one) {
    case "v":
    case "videos":
    case "embed":
    case "shorts":
      return two;
    case "watch":
      return parsed.searchParams.get("v");
  }

  return parsed.searchParams.get("v");
}