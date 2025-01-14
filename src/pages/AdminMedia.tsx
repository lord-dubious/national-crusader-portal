import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const AdminMedia = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Media Library</h2>
      </div>
      <MediaLibrary />
    </div>
  );
};