import {
  createUser,
  createMyUserImage,
  createUserImage,
} from "@/actions/user/create";
import {
  updateUserDetails,
  updateMyUserDetails,
  updateUserPreferences,
  updateMyPreferences,
  updateUserImage,
  updateUserSession,
  updateMySession,
} from "@/actions/user/update";
import {
  getUserImagesInfo,
  getUserInfo,
  searchUsers,
  searchUsersConfidential,
  currentPages,
  checkCurrentPage,
  currentPermissions,
  checkCurrentPermission,
  getCurrentUserInfo,
  getUserSessionsInfo,
  getUserPreferencesInfo,
  getMySessionsInfo,
  getMyPreferencesInfo,
  getUserInfoConfidential,
  getMyImagesInfo,
  getMyProductViewsInfo
} from "@/actions/user/info";
import { deleteUser, deleteMyAccount } from "@/actions/user/delete";

// Types
type CreateUserResponse = Awaited<ReturnType<typeof createUser>>;
type CreateUserImageResponse = Awaited<ReturnType<typeof createUserImage>>;
type CreateMyUserImageResponse = Awaited<ReturnType<typeof createMyUserImage>>;

type UpdateUserDetailsResponse = Awaited<ReturnType<typeof updateUserDetails>>;
type UpdateMyUserDetailsResponse = Awaited<
  ReturnType<typeof updateMyUserDetails>
>;
type UpdateUserPreferencesResponse = Awaited<
  ReturnType<typeof updateUserPreferences>
>;
type UpdateMyPreferencesResponse = Awaited<
  ReturnType<typeof updateMyPreferences>
>;
type UpdateUserImageResponse = Awaited<ReturnType<typeof updateUserImage>>;
type UpdateUserSessionResponse = Awaited<ReturnType<typeof updateUserSession>>;
type UpdateMySessionResponse = Awaited<ReturnType<typeof updateMySession>>;

type GetUserImagesInfoResponse = Awaited<ReturnType<typeof getUserImagesInfo>>;
type GetUserInfoResponse = Awaited<ReturnType<typeof getUserInfo>>;
type SearchUsersResponse = Awaited<ReturnType<typeof searchUsers>>;
type SearchUsersConfidentialResponse = Awaited<
  ReturnType<typeof searchUsersConfidential>
>;
type GetCurrentUserInfoResponse = Awaited<
  ReturnType<typeof getCurrentUserInfo>
>;
type GetUserSessionsInfoResponse = Awaited<
  ReturnType<typeof getUserSessionsInfo>
>;
type GetUserPreferencesInfoResponse = Awaited<
  ReturnType<typeof getUserPreferencesInfo>
>;
type GetMySessionsInfoResponse = Awaited<ReturnType<typeof getMySessionsInfo>>;
type GetMyPreferencesInfoResponse = Awaited<
  ReturnType<typeof getMyPreferencesInfo>
>;
type GetUserInfoConfidentialResponse = Awaited<
  ReturnType<typeof getUserInfoConfidential>
>;
type GetMyImagesInfoResponse = Awaited<ReturnType<typeof getMyImagesInfo>>;
export type GetMyProductViewsInfoResponse = Awaited<ReturnType<typeof getMyProductViewsInfo>>;
type DeleteUserResponse = Awaited<ReturnType<typeof deleteUser>>;
type DeleteMyAccountResponse = Awaited<ReturnType<typeof deleteMyAccount>>;

// Success Types
export type CreateUserSuccessType = Extract<CreateUserResponse, { user: any }>;
export type CreateUserImageSuccessType = Extract<
  CreateUserImageResponse,
  { images: { id: string }[] }
>;
export type CreateMyUserImageSuccessType = Extract<
  CreateMyUserImageResponse,
  { images: { id: string }[] }
>;

export type UpdateUserDetailsSuccessType = Extract<
  UpdateUserDetailsResponse,
  { user: { id: string } }
>;
export type UpdateMyUserDetailsSuccessType = Extract<
  UpdateMyUserDetailsResponse,
  { user: { id: string } }
>;
export type UpdateUserPreferencesSuccessType = Extract<
  UpdateUserPreferencesResponse,
  { preferences: { id: string } }
>;
export type UpdateMyPreferencesSuccessType = Extract<
  UpdateMyPreferencesResponse,
  { preferences: { id: string } }
>;
export type UpdateUserImageSuccessType = Extract<
  UpdateUserImageResponse,
  { image: { id: string } }
>;
export type UpdateUserSessionSuccessType = Extract<
  UpdateUserSessionResponse,
  { session: { id: string } }
>;
export type UpdateMySessionSuccessType = Extract<
  UpdateMySessionResponse,
  { session: { id: string } }
>;

export type GetUserImagesInfoSuccessType = Extract<
  GetUserImagesInfoResponse,
  { images: { id: string }[] }
>;
export type GetUserInfoSuccessType = Extract<
  GetUserInfoResponse,
  { user: { id: string } }
>;
export type SearchUsersSuccessType = Extract<
  SearchUsersResponse,
  { users: { user: { id: string } }[] }
>;
export type SearchUsersConfidentialSuccessType = Extract<
  SearchUsersConfidentialResponse,
  { users: { user: { id: string } }[] }
>;
export type GetCurrentUserInfoSuccessType = Extract<
  GetCurrentUserInfoResponse,
  { user: { id: string } }
>;
export type GetUserSessionsInfoSuccessType = Extract<
  GetUserSessionsInfoResponse,
  { sessions: { id: string }[] }
>;
export type GetUserPreferencesInfoSuccessType = Extract<
  GetUserPreferencesInfoResponse,
  { preferences: { id: string } }
>;
export type GetMySessionsInfoSuccessType = Extract<
  GetMySessionsInfoResponse,
  { sessions: { id: string }[] }
>;
export type GetMyPreferencesInfoSuccessType = Extract<
  GetMyPreferencesInfoResponse,
  { preferences: { id: string } }
>;
// Add these new types

// Add these new success types
export type GetUserInfoConfidentialSuccessType = Extract<
  GetUserInfoConfidentialResponse,
  { user: any }
>;
export type GetMyImagesInfoSuccessType = Extract<
  GetMyImagesInfoResponse,
  { images: any }
>;

export type GetMyProductViewsInfoSuccessType = Extract<
GetMyProductViewsInfoResponse,
  { userId: any }
>;

export type DeleteUserSuccessType = Extract<
  DeleteUserResponse,
  { success: boolean }
>;

export type DeleteMyAccountSuccessType = Extract<
  DeleteMyAccountResponse,
  { success: boolean }
>;


// Type Guards
export function isCreateUserSuccess(
  response: CreateUserResponse
): response is CreateUserSuccessType {
  return "user" in response && !("error" in response);
}

export function isCreateUserImagesSuccess(
  response: CreateUserImageResponse
): response is CreateUserImageSuccessType {
  return "images" in response && !("error" in response);
}

export function isCreateMyUserImagesSuccess(
  response: CreateMyUserImageResponse
): response is CreateMyUserImageSuccessType {
  return "images" in response && !("error" in response);
}

export function isUpdateUserDetailsSuccess(
  response: UpdateUserDetailsResponse
): response is UpdateUserDetailsSuccessType {
  return "user" in response && !("error" in response);
}

export function isUpdateMyUserDetailsSuccess(
  response: UpdateMyUserDetailsResponse
): response is UpdateMyUserDetailsSuccessType {
  return "user" in response && !("error" in response);
}

export function isUpdateUserPreferencesSuccess(
  response: UpdateUserPreferencesResponse
): response is UpdateUserPreferencesSuccessType {
  return "preferences" in response && !("error" in response);
}

export function isUpdateMyPreferencesSuccess(
  response: UpdateMyPreferencesResponse
): response is UpdateMyPreferencesSuccessType {
  return "preferences" in response && !("error" in response);
}

export function isUpdateUserImagesSuccess(
  response: UpdateUserImageResponse
): response is UpdateUserImageSuccessType {
  return "images" in response && !("error" in response);
}

export function isUpdateUserSessionSuccess(
  response: UpdateUserSessionResponse
): response is UpdateUserSessionSuccessType {
  return "session" in response && !("error" in response);
}

export function isUpdateMySessionSuccess(
  response: UpdateMySessionResponse
): response is UpdateMySessionSuccessType {
  return "session" in response && !("error" in response);
}

export function isGetUserImagesInfoSuccess(
  response: GetUserImagesInfoResponse
): response is GetUserImagesInfoSuccessType {
  return "images" in response && !("error" in response);
}

export function isGetUserInfoSuccess(
  response: GetUserInfoResponse
): response is GetUserInfoSuccessType {
  return "user" in response && !("error" in response);
}

export function isSearchUsersSuccess(
  response: SearchUsersResponse
): response is SearchUsersSuccessType {
  return "users" in response && !("error" in response);
}

export function isSearchUsersConfidentialSuccess(
  response: SearchUsersConfidentialResponse
): response is SearchUsersConfidentialSuccessType {
  return "users" in response && !("error" in response);
}

export function isGetCurrentUserInfoSuccess(
  response: GetCurrentUserInfoResponse
): response is GetCurrentUserInfoSuccessType {
  return "user" in response && !("error" in response);
}

export function isGetUserSessionsInfoSuccess(
  response: GetUserSessionsInfoResponse
): response is GetUserSessionsInfoSuccessType {
  return "sessions" in response && !("error" in response);
}

export function isGetUserPreferencesInfoSuccess(
  response: GetUserPreferencesInfoResponse
): response is GetUserPreferencesInfoSuccessType {
  return "preferences" in response && !("error" in response);
}

export function isGetMySessionsInfoSuccess(
  response: GetMySessionsInfoResponse
): response is GetMySessionsInfoSuccessType {
  return "sessions" in response && !("error" in response);
}

export function isGetMyPreferencesInfoSuccess(
  response: GetMyPreferencesInfoResponse
): response is GetMyPreferencesInfoSuccessType {
  return "preferences" in response && !("error" in response);
}

// Add these new type guards
export function isGetUserInfoConfidentialSuccess(
  response: GetUserInfoConfidentialResponse
): response is GetUserInfoConfidentialSuccessType {
  return "user" in response && !("error" in response);
}

export function isGetMyImagesInfoSuccess(
  response: GetMyImagesInfoResponse
): response is GetMyImagesInfoSuccessType {
  return "images" in response && !("error" in response);
}

export function isGetMyProductViewsInfoSuccess(
  response: GetMyProductViewsInfoResponse
): response is GetMyProductViewsInfoSuccessType {
  return "userId" in response && !("error" in response);
}

export function isDeleteUserSuccess(
  response: DeleteUserResponse
): response is DeleteUserSuccessType {
  return "success" in response && !("error" in response);
}

export function isDeleteMyAccountSuccess(
  response: DeleteMyAccountResponse
): response is DeleteMyAccountSuccessType {
  return "success" in response && !("error" in response);
}
