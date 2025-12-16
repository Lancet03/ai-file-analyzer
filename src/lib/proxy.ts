export const runtime = "nodejs";

const HOP_BY_HOP = [
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
];

export function buildUpstreamUrl(req: Request, upstreamPath: string) {
  const origin = process.env.BACKEND_ORIGIN;
  if (!origin) throw new Error("BACKEND_ORIGIN is not set");

  const inUrl = new URL(req.url);
  const outUrl = new URL(origin);
  outUrl.pathname = upstreamPath;
  outUrl.search = inUrl.search; // пробрасываем query string

  return outUrl.toString();
}

export function forwardHeaders(req: Request) {
  const h = new Headers(req.headers);

  // удаляем hop-by-hop и то, что нельзя/не нужно пробрасывать
  for (const k of HOP_BY_HOP) h.delete(k);

  return h;
}

export async function proxyFetch(req: Request, upstreamUrl: string) {
  const headers = forwardHeaders(req);

  // Важно: duplex требуется для streaming body в Node fetch (undici)
  const init: RequestInit & { duplex?: "half" } = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  // GET/HEAD без body
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body; // стримим как есть (подходит и для multipart)
    init.duplex = "half";
  }

  const upstreamRes = await fetch(upstreamUrl, init);

  // Копируем статус/заголовки/тело как есть
  const outHeaders = new Headers(upstreamRes.headers);
  // при желании тут можно подчистить/переопределить заголовки

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: outHeaders,
  });
}
