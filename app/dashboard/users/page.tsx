import { searchRoles } from "@/actions/roles/info";
import { searchUsers } from "@/actions/user/info";
import AllUsers from "@/components/admin/users/AllUsers";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PaginationProvider } from "@/context/PaginationContext";
import { isSearchUsersSuccess } from "@/types/user";
import { currentUser } from "@/utils/auth";
const itemsPerPage = 10 as const;

export default async function page(props: {
  searchParams: Promise<{ page: string; search: string }>;
}) {
  const searchParams = await props.searchParams;

  const { page, search } = searchParams;

  const user = await currentUser();
  if (!user) {
    return <ErrorMessage message="You are not logged in" />;
  }

  const pageStart = (Number(page) - 1) * itemsPerPage;
  const pageEnd = Number(page) * itemsPerPage;

  const users = await searchUsers(
    search || "",
    {
      limit: {
        start: page ? pageStart : 0,
        end: page ? pageEnd : itemsPerPage,
      },
      users: {
        role: {},
        images: {
          limit: {
            start: 0,
            end: 1,
          },
        },
      },
      count: true,
    },
    undefined
  );
  const roles = await searchRoles("", undefined, {
    roles: {},
  });

  console.log(users);
  return (
    <PaginationProvider
      initialPage={1}
      initialTotalItems={(isSearchUsersSuccess(users) && users?.count) || 0}
      initialItemsPerPage={itemsPerPage}
    >
      {!isSearchUsersSuccess(users) && <ErrorMessage message={users.error} />}
      <AllUsers
        roles={roles}
        initialUsers={
          isSearchUsersSuccess(users)
            ? users
            : {
                users: [],
                count: 0,
              }
        }
        usersPerPage={itemsPerPage}
        error={
          !isSearchUsersSuccess(users) && <ErrorMessage message={users.error} />
        }
      />
    </PaginationProvider>
  );
}
