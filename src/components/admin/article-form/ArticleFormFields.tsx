import { ArticleBasicInfo } from "./components/ArticleBasicInfo";
import { ArticleCategory } from "./components/ArticleCategory";
import { ArticleContent } from "./components/ArticleContent";
import { ArticleStatus } from "./components/ArticleStatus";

export const ArticleFormFields = () => {
  return (
    <div className="space-y-6">
      <ArticleBasicInfo />
      <ArticleCategory />
      <ArticleContent />
      <ArticleStatus />
    </div>
  );
};