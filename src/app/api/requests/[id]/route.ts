import { buildUpstreamUrl, proxyFetch } from "@/lib/proxy";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const url = buildUpstreamUrl(req, `/api/requests/${encodeURIComponent(id)}`);
  return proxyFetch(req, url);
}
