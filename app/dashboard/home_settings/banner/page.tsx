import { getPageContentInfo } from "@/actions/pageContent/info";
import AdminBannerEditor from "@/components/admin/home_settings/banner/AdminBannerEditor";
import AdminHeroPreview from "@/components/admin/home_settings/hero/AdminHeroPreview";
import { isPageContentInfoSuccess } from "@/types/pageContent";

const path = "home";
const section = "banner";

export default async function page() {
  const response = await getPageContentInfo(
    { path, section },
    {
      files: {
        count: true,
        limit: undefined,
      },
    }
  );

  return (
    <AdminBannerEditor
      page={{ path, section }}
      _pageId={
        isPageContentInfoSuccess(response) ? response.pageContent.id : ""
      }
      initialImages={
        isPageContentInfoSuccess(response)
          ? response.files.map((file) => {
              return {
                id: file.id,
                link: file.link,
                name: file.name,
              };
            })
          : []
      }
    />
  );
}
