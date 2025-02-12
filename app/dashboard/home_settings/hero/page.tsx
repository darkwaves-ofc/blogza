import { getPageContentInfo } from "@/actions/pageContent/info";
import AdminHeroPreview from "@/components/admin/home_settings/hero/AdminHeroPreview";
import { isPageContentInfoSuccess } from "@/types/pageContent";

const path = "home";
const section = "hero";

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
    <AdminHeroPreview
      page={{ path, section }}
      _pageId={
        isPageContentInfoSuccess(response) ? response.pageContent.id : ""
      }
      initialContent={
        isPageContentInfoSuccess(response) ? response.pageContent.content : ""
      }
      initialTitle={
        isPageContentInfoSuccess(response) ? response.pageContent.title : ""
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
