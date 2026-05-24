import { RequestStatusesCard } from "@/components/request-statuses-card";
import { UploadRequestCard } from "@/components/upload-request-card";

export default function Home() {
  return (
    <div className="space-y-6">
      <UploadRequestCard />
      <RequestStatusesCard />
    </div>
  );
}
