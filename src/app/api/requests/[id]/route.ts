import { buildUpstreamUrl, proxyFetch } from "@/lib/proxy";

export const runtime = "nodejs";

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const url = buildUpstreamUrl(
    req,
    `/api/requests/${encodeURIComponent(ctx.params.id)}`
  );
  return proxyFetch(req, url);
}
