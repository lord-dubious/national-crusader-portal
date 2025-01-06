import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTagManagement } from "./tag/useTagManagement";
import { TagForm } from "./tag/TagForm";
import { TagList } from "./tag/TagList";
import type { TagFormValues } from "./tag/types";

export const TagManagement = () => {
  const {
    tags,
    isLoading,
    isEditing,
    selectedTag,
    setIsEditing,
    setSelectedTag,
    createTag,
    updateTag,
    deleteTag,
  } = useTagManagement();

  const handleSubmit = async (values: TagFormValues) => {
    if (isEditing && selectedTag) {
      await updateTag.mutateAsync({ ...values, id: selectedTag.id });
    } else {
      await createTag.mutateAsync(values);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-[#222222] border-[#333333]">
      <CardHeader>
        <CardTitle className="text-white">Tag Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TagForm
          onSubmit={handleSubmit}
          initialValues={selectedTag}
          isSubmitting={createTag.isPending || updateTag.isPending}
        />
        {tags && (
          <TagList
            tags={tags}
            onEdit={(tag) => {
              setSelectedTag(tag);
              setIsEditing(true);
            }}
            onDelete={(id) => deleteTag.mutate(id)}
          />
        )}
      </CardContent>
    </Card>
  );
};