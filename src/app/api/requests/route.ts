import { buildUpstreamUrl, proxyFetch } from "@/lib/proxy";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = buildUpstreamUrl(req, "/api/requests");
  return proxyFetch(req, url);
}

export async function POST(req: Request) {
  const url = buildUpstreamUrl(req, "/api/requests");
  return proxyFetch(req, url);
}
