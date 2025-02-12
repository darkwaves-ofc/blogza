import { getAllPopups, searchPopupsInfo } from "@/actions/popups/info";
import AdminPopupManagement from "@/components/admin/popup";
import { isGetAllPopupsSuccess, isSearchPopupsInfoSuccess } from "@/types/popups";
export const metadata = {
  title: "Popup Management",
  description: "Manage your website popups",
  theme: {
    dark: true
  }
};

export default async function page() {
  const response = await searchPopupsInfo("", undefined, {
    popups: {
      views: true,
      clicks: true,
    },
    count: true,
    limit: undefined,
  });
  return (
    <AdminPopupManagement
      initialData={isSearchPopupsInfoSuccess(response) ? response.popups : []}
    />
  );
}
