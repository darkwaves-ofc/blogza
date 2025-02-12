import { db } from "@/lib/db";
import { getUserById } from "./user";
import {
  getAllPages,
  getAllPermissions,
  getPages,
  getPermissions,
  PageType,
  Pages,
  PermissionType,
  Permissions,
  getAllPageGroups,
  getAllPermissionGroups,
} from "@/lib/permission_manager";

/**
 * Retrieves the role associated with the specified user ID.
 *
 * @param userId - The ID of the user to retrieve the role for.
 * @returns The role associated with the user, or `null` if the user is not found or does not have a role.
 */
export const getUserRole = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");
    if (!user.roleId) throw new Error("User does not have a role");
    const role = await getRoleById(user.roleId);
    return role;
  } catch (error) {
    return null;
  }
};
/**
 * Retrieves the permissions for the user with the given userId.
 *
 * @param userId - The ID of the user to retrieve permissions for. Can be undefined.
 * @returns The permissions for the user, or null if an error occurs.
 */
export const getUserPermissions = async (userId: string | undefined) => {
  try {
    const user = userId ? await getUserById(userId) : undefined;
    const role = user ? await getUserRole(user.id) : undefined;
    const perm = user?.system
      ? getAllPermissions()
      : role?.permissions || [
          user ? Permissions.logged_in_users : Permissions.not_logged_in_users,
        ];
    const permissions = getPermissions(perm as PermissionType[]);
    return permissions;
  } catch (error) {
    console.log(error);
    return null;
  }
};
/**
 * Retrieves the pages associated with the specified user ID.
 *
 * @param userId - The ID of the user to retrieve the pages for. If not provided, the function will return the pages for a non-logged-in user.
 * @returns The pages associated with the user, or `null` if the user is not found or does not have any pages.
 */
export const getUserPages = async (userId: string | undefined) => {
  try {
    const user = userId ? await getUserById(userId) : undefined;
    const role = user ? await getUserRole(user.id) : undefined;
    const pa = user?.system
      ? getAllPages()
      : role?.pages || [
          user ? Pages.logged_in_users : Pages.not_logged_in_users,
        ];
    const pages = getPages(pa as PageType[]);
    return pages;
  } catch (error) {
    return null;
  }
};

/**
 * Checks if the user with the given userId has the specified permission.
 *
 * @param userId - The ID of the user to check permissions for. Can be undefined.
 * @param permission - The permission to check for.
 * @returns `true` if the user has the specified permission, `false` otherwise.
 */
export const havePermission = async (
  userId: string | undefined,
  permission: PermissionType
) => {
  try {
    const permissions = await getUserPermissions(userId);
    if (!permissions) throw new Error("User does not have any permissions");
    return Boolean(Array.from(permissions).find((p) => p === permission));
  } catch (error) {
    console.log(error, "Error");
    return false;
  }
};
/**
 * Checks if the user with the specified ID has access to the given page.
 *
 * @param userId - The ID of the user to check. Can be undefined if the user is not logged in.
 * @param page - The page to check if the user has access to.
 * @returns `true` if the user has access to the page, `false` otherwise.
 */
export const havePage = async (userId: string | undefined, page: PageType) => {
  try {
    const pages = await getUserPages(userId);
    if (!pages) throw new Error("User does not have any pages");
    console.log(pages);
    return Boolean(Array.from(pages).find((p) => p === page));
  } catch (error) {
    return false;
  }
};
/**
 * Creates a new role with the specified name, permissions, pages, and position.
 *
 * @param name - The name of the new role.
 * @param permissionsArr - An array of permission types to associate with the new role.
 * @param pagesArr - An array of page types to associate with the new role.
 * @param position - The position of the new role, used for ordering.
 * @returns The newly created role, or `null` if an error occurred.
 */
export const createRole = async (
  name: string,
  permissionsArr: PermissionType[],
  pagesArr: PageType[],
  position: number
) => {
  try {
    const permissions = Array.from(getPermissions(permissionsArr));
    const pages = Array.from(getPages(pagesArr));
    const role = await db.role.create({
      data: {
        position,
        name,
        permissions,
        pages,
      },
    });
    return role;
  } catch (error) {
    return null;
  }
};
/**
 * Retrieves a role by its name.
 *
 * @param name - The name of the role to retrieve.
 * @returns The role with the specified name, or `null` if no such role exists.
 */
export const getRoleByName = async (name: string) => {
  try {
    const role = await db.role.findUnique({ where: { name } });
    return role;
  } catch (error) {
    return null;
  }
};
/**
 * Retrieves a role by its unique identifier.
 *
 * @param id - The unique identifier of the role to retrieve.
 * @returns The role with the specified ID, or `null` if no such role exists.
 */
export const getRoleById = async (id: string) => {
  try {
    const role = await db.role.findUnique({ where: { id } });
    return role;
  } catch (error) {
    return null;
  }
};
