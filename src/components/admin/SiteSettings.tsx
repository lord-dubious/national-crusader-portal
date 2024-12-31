import { LogoSettings } from "./settings/LogoSettings";
import { SocialLinksSettings } from "./settings/SocialLinksSettings";

export const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Site Settings</h2>
        <div className="space-y-6">
          <LogoSettings />
          <SocialLinksSettings />
        </div>
      </div>
    </div>
  );
};