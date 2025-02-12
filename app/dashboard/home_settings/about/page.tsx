import { getPageContentInfo } from "@/actions/pageContent/info";
import AdminAboutEditor from "@/components/admin/home_settings/about/AdminAboutEditor";
import { isPageContentInfoSuccess } from "@/types/pageContent";

const path = "home";
const section = "about";

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
    <AdminAboutEditor
      page={{ path, section }}
      _pageId={
        isPageContentInfoSuccess(response) ? response.pageContent.id : ""
      }
      initialContent={
        isPageContentInfoSuccess(response) ? response.pageContent.content : ""
      }
    />
  );
}
