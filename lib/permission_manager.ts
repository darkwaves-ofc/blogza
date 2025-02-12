import { create } from "domain";

// Define types for raw permissions and permission groups
export interface PageInfo {
  name: string;
  pages: RawPageType[];
  description: string;
}
export interface PermissionInfo {
  name: string;
  permissions: RawPermissionType[];
  description: string;
}
export const RawPermissions = {
  create_product: "create_product",
  delete_product: "delete_product",
  create_file: "create_file",
  edit_product: "edit_product",
  view_product: "view_product",
  update_product_stock: "update_product_stock",
  view_page_content: "view_page_content",
  delete_user: "delete_user",
  edit_user: "edit_user",
  view_user: "view_user",
  create_user: "create_user",
  manage_own_cart: "manage_own_cart",

  view_category: "view_category",

  change_role: "change_role",
  create_role: "create_role",
  delete_role: "delete_role",
  edit_role: "edit_role",
  view_event: "view_event",
  create_event: "create_event",
  edit_event: "edit_event",
  delete_event: "delete_event",
  view_role: "view_role",
  view_role_confidential: "view_role_confidential",
  create_location: "create_location",
  create_category: "create_category",
  create_coupon: "create_coupon",
  view_coupon: "view_coupon",
  edit_coupon: "edit_coupon",
  delete_coupon: "delete_coupon",
  manage_purchases: "manage_purchases",
  manage_orders: "manage_orders",
  manage_page_content: "manage_page_content",
  manage_transactions: "manage_transactions",
  place_order: "place_order",
  claim_coupon: "claim_coupon",
  checkout_order: "checkout_order",
  create_popup: "create_popup",
  update_popup: "update_popup",
  view_popups: "view_popups",
  view_reviews: "view_reviews",
  create_review: "create_review",
  delete_review: "delete_review",
  edit_review: "edit_review",
  view_billing_details: "view_billing_details",
  view_billing_details_confidential: "view_billing_details_confidential",
  view_coupons: "view_coupons",
  view_coupons_confidential: "view_coupons_confidential",
  delete_popup: "delete_popup",
  view_user_confidential: "view_user_confidential",
  manage_user_wallets: "manage_user_wallets",
  // spin weel
  create_spinwheel: "create_spinwheel",
  edit_spinwheel: "edit_spinwheel",
  delete_spinwheel: "delete_spinwheel",
  view_spinwheels: "view_spinwheels",
  // notifications
  create_notification: "create_notification",
  emit_notification: "emit_notification",
  update_notification: "update_notification",
  delete_notification: "delete_notification",
  view_notification: "view_notification",
  // support tickets
  create_support_ticket: "create_support_ticket",
  view_support_tickets: "view_support_tickets",
  view_support_tickets_confidential: "view_support_tickets_confidential", // needed for viewving others tickets
  delete_support_ticket: "delete_support_ticket",
  delete_support_ticket_confidential: "delete_support_ticket_confidential", // needed for deleting others tickets
  edit_support_ticket: "edit_support_ticket",
  edit_support_ticket_confidential: "edit_support_ticket_confidential", // needed for editing others tickets
  close_support_ticket: "close_support_ticket",
  close_support_ticket_confidential: "close_support_ticket_confidential", // needed for closing others tickets
  accept_support_ticket: "accept_support_ticket",
  send_support_ticket_response: "send_support_ticket_response",
  send_support_ticket_response_file: "send_support_ticket_response_file",
  view_support_ticket_responses: "view_support_ticket_responses",
  view_support_ticket_response_files: "view_support_ticket_response_files",
  view_support_ticket_response_views: "view_support_ticket_response_views",
  create_support_ticket_view: "create_support_ticket_view",
  edit_support_ticket_response: "edit_support_ticket_response",
  delete_support_ticket_view: "delete_support_ticket_view",
  delete_support_ticket_response: "delete_support_ticket_response",
  delete_support_ticket_response_file: "delete_support_ticket_response_file",
  delete_support_ticket_response_confidential:
    "delete_support_ticket_response_confidential", // needed for deleting others responses
  delete_support_ticket_response_file_confidential:
    "delete_support_ticket_response_file_confidential",
  // orders
  view_orders: "view_orders",
  view_orders_confidential: "view_orders_confidential",
  create_order: "create_order",
  // wallet
  view_points_wallet: "view_points_wallet",
  view_points_wallet_confidential: "view_points_wallet_confidential",
  view_points_wallet_transactions: "view_points_wallet_transactions",
  view_points_wallet_transactions_confidential:
    "view_points_wallet_transactions_confidential",
  create_points_wallet_confidential: "create_points_wallet_confidential",
  create_points_wallet: "create_points_wallet",
  create_points_transaction: "create_points_transaction",
  // spin wheel
  view_wheel_confidential: "view_wheel_confidential",
  view_wheel: "view_wheel",
  view_prize_confidential: "view_prize_confidential",
  view_prize: "view_prize",
  view_wheel_usage_confidential: "view_wheel_usage_confidential",
  view_wheel_usage: "view_wheel_usage",
  // payslip
  view_payslip: "view_payslip",
  view_payslip_confidential: "view_payslip_confidential",
  view_payslip_files: "view_payslip_files",
  view_payslip_files_confidential: "view_payslip_files_confidential",
  create_payslip: "create_payslip",
  create_payslip_file: "create_payslip_file",

  create_class: "create_class",
  delete_class: "delete_class",
  view_class: "view_class",
  edit_class: "edit_class",

  view_teacher: "view_teacher",
  create_teacher: "create_teacher",
  edit_teacher: "edit_teacher",
  delete_teacher: "delete_teacher",

  create_student: "create_student",
  delete_student: "delete_student",
  edit_student: "edit_student",
  view_student: "view_student",

  view_parent: "view_parent",
  create_parent: "create_parent",
  edit_parent: "edit_parent",
  delete_parent: "delete_parent",

  create_subject: "create_subject",
  delete_subject: "delete_subject",
  edit_subject: "edit_subject",
  view_subject: "view_subject",

  create_lesson: "create_lesson",
  delete_lesson: "delete_lesson",
  edit_lesson: "edit_lesson",
  view_lesson: "view_lesson",

  create_exam: "create_exam",
  delete_exam: "delete_exam",
  edit_exam: "edit_exam",
  view_exam: "view_exam",

  create_assignment: "create_assignment",
  delete_assignment: "delete_assignment",
  edit_assignment: "edit_assignment",
  view_assignment: "view_assignment",

  create_result: "create_result",
  delete_result: "delete_result",
  edit_result: "edit_result",
  view_result: "view_result",

  create_announcement: "create_announcement",
  delete_announcement: "delete_announcement",
  edit_announcement: "edit_announcement",
  view_announcement: "view_announcement",
} as const;

export type RawPermissionType =
  (typeof RawPermissions)[keyof typeof RawPermissions];

// Define permission groups using object literals
export const PermissionGroups = {
  administrator: "administrator",
  moderator: "moderator",
  supporter: "supporter",
  logged_in_users: "logged_in_users",
  not_logged_in_users: "not_logged_in_users",
} as const;

export type PermissionGroupType =
  (typeof PermissionGroups)[keyof typeof PermissionGroups];

// Define raw pages using object literals
export const RawPages = {
  Dashboard: "dashboard",
  announcements: "announcements",
  assignments: "assignments",
  classes: "classes",
  events: "events",
  exams: "exams",
  home_settings: "home_settings",
  lessons: "lessons",
  notifications: "notifications",
  popup: "popup",
  results: "results",
  roles: "roles",
  settings: "settings",
  support_tickets: "support_tickets",
  users: "users",

  parents: "parents",
  students: "students",
  teachers: "teachers",

  parent: "parent",
  student: "student",
  teacher: "teacher",
} as const;

export type RawPageType = (typeof RawPages)[keyof typeof RawPages];

// Define page groups using object literals
export const PageGroups = {
  administrator: "administrator",
  moderator: "moderator",
  logged_in_users: "logged_in_users",
  not_logged_in_users: "not_logged_in_users",
} as const;

export type PageGroupType = (typeof PageGroups)[keyof typeof PageGroups];

// Combine Permissions and Groups in one object
export const Permissions = {
  ...RawPermissions,
  ...PermissionGroups,
} as const;

/**
 * Represents the type of a permission that a user can have.
 * The `Permissions` object contains all the available permissions.
 */
export type PermissionType = (typeof Permissions)[keyof typeof Permissions];

// Combine Pages and Groups in one object
export const Pages = {
  ...RawPages,
  ...PageGroups,
} as const;

export type PageType = (typeof Pages)[keyof typeof Pages];

// Define permissions description object
/**
 * Defines the different descriptions for the permissions that users can have.
 * Each permission has a description that explains what the permission is used for.
 */
export const permissionsDescription = {
  [RawPermissions.create_product]: "to create a product",
  [RawPermissions.create_file]: "to create a file",
  [RawPermissions.delete_product]: "to delete a product",
  [RawPermissions.edit_product]: "to edit a product",
  [RawPermissions.create_category]: "to  create a category",
  [RawPermissions.place_order]: "to place a order",
  [RawPermissions.view_product]: "to view a product",
  [RawPermissions.view_category]: "to view a category",
  [RawPermissions.delete_user]: "to delete a user",
  [RawPermissions.edit_user]: "to edit a user",
  [RawPermissions.checkout_order]: "to checkout an order",
  [RawPermissions.view_user_confidential]: "to view a user",
  [RawPermissions.view_user]: "to view a user",
  [RawPermissions.manage_own_cart]: "to manage own cart",
  [RawPermissions.create_support_ticket]: "to create a support ticket",
  [RawPermissions.view_event]: "to view an event",
  [RawPermissions.view_support_tickets]: "to view a support ticket",
  [RawPermissions.delete_support_ticket]: "to delete a support ticket",
  [RawPermissions.edit_support_ticket]: "to edit a support ticket",
  [RawPermissions.change_role]: "to change a role",
  [RawPermissions.create_role]: "to create a role",
  [RawPermissions.delete_role]: "to delete a role",
  [RawPermissions.edit_role]: "to edit a role",
  [RawPermissions.edit_event]: "to edit an event",
  [RawPermissions.delete_event]: "to delete an event",
  [RawPermissions.view_role]: "to view a role",
  [RawPermissions.create_location]: "to create a location",
  [RawPermissions.create_popup]: "to create a popup",
  [RawPermissions.update_popup]: "to update a popup",
  [RawPermissions.view_popups]: "to view a popup",
};

// Define pages description object
/**
 * Defines the different descriptions for the pages that users can access based on their permissions.
 * Each page has a description that explains what the page is used for.
 */
export const pagesDescription = {
  [RawPages.Dashboard]: "This is the dashboard page",

  [RawPages.announcements]: "This is the announcements page",
  [RawPages.assignments]: "This is the assignments page",
  [RawPages.classes]: "This is the classes page",
  [RawPages.events]: "This is the events page",
  [RawPages.exams]: "This is the exams page",
  [RawPages.home_settings]: "This is the home settings page",
  [RawPages.lessons]: "This is the lessons page",
  [RawPages.notifications]: "This is the notifications page",
  [RawPages.parents]: "This is the parents page",
  [RawPages.popup]: "This is the popup page",
  [RawPages.results]: "This is the results page",
  [RawPages.roles]: "This is the roles page",
  [RawPages.settings]: "This is the settings page",
  [RawPages.support_tickets]: "This is the support tickets page",

  [RawPages.users]: "This is the users page",
  [RawPages.students]: "This is the students page",
  [RawPages.teachers]: "This is the teachers page",

  [RawPages.parent]: "This is the parent page",
  [RawPages.student]: "This is the student page",
  [RawPages.teacher]: "This is the teacher page",
};
// Accessor functions/**
/*
 * Retrieves all raw permission types defined in the application.
 *
 * @returns A set of all raw permission types.
 */
export const getAllPermissions = () => Object.values(RawPermissions);
/**
 * Retrieves all permission groups defined in the application.
 *
 * @returns A set of all permission groups.
 */
export const getAllPermissionGroups = () => Object.values(PermissionGroups);
/**
 * Retrieves all raw page types defined in the application.
 *
 * @returns A set of all raw page types.
 */
export const getAllPages = () => Object.values(RawPages);
/**
 * Retrieves all page groups defined in the application.
 *
 * @returns A set of all page groups.
 */
export const getAllPageGroups = () => Object.values(PageGroups);
// Permission Groups definition
/**
 * Defines the different permission groups that users can be assigned to.
 * Each group has a name, a list of permissions that users in that group have, and a description.
 */
export const permissionsGroups = [
  {
    name: PermissionGroups.administrator,
    permissions: getAllPermissions(),
    description: "This is the administrator permissions (DANGER)",
  },
  {
    name: PermissionGroups.moderator,
    permissions: [
      RawPermissions.delete_user,
      RawPermissions.edit_user,
      RawPermissions.view_user,
      RawPermissions.create_support_ticket,
      RawPermissions.view_support_tickets_confidential,
      RawPermissions.delete_support_ticket,
      RawPermissions.create_popup,
      RawPermissions.update_popup,
    ],
    description: "These are the moderator permissions",
  },
  {
    name: PermissionGroups.supporter,
    permissions: [
      RawPermissions.view_support_tickets_confidential,
      RawPermissions.close_support_ticket,
      RawPermissions.view_support_tickets,
      RawPermissions.edit_support_ticket_response,
      RawPermissions.create_support_ticket_view,
      RawPermissions.delete_support_ticket_response_file,
      RawPermissions.delete_support_ticket_response,
      RawPermissions.accept_support_ticket,
      RawPermissions.view_category,
      RawPermissions.view_orders_confidential,
      RawPermissions.view_product,
      RawPermissions.view_event,
      RawPermissions.manage_purchases,
      RawPermissions.view_user_confidential,
      RawPermissions.create_file,
      RawPermissions.delete_support_ticket,
      RawPermissions.view_coupons_confidential,
      RawPermissions.view_role_confidential,
    ],
    description: "These are the supporter permissions",
  },
  {
    name: PermissionGroups.logged_in_users,
    permissions: [
      RawPermissions.view_product,
      RawPermissions.view_event,
      RawPermissions.view_user,
      RawPermissions.place_order,
      RawPermissions.checkout_order,
      RawPermissions.create_file,
      RawPermissions.manage_own_cart,
      RawPermissions.view_page_content,
      RawPermissions.view_event,
      RawPermissions.view_category,
      RawPermissions.view_popups,
      RawPermissions.manage_user_wallets,
      RawPermissions.edit_review,
      RawPermissions.create_review,
      RawPermissions.view_reviews,
      RawPermissions.delete_review,
      RawPermissions.view_orders,
      RawPermissions.view_billing_details,
      RawPermissions.view_coupons,
      RawPermissions.create_order,
      // support
      RawPermissions.edit_support_ticket,
      RawPermissions.edit_support_ticket_response,
      RawPermissions.view_support_tickets,
      RawPermissions.view_support_ticket_response_files,
      RawPermissions.view_support_ticket_response_views,
      RawPermissions.send_support_ticket_response,
      RawPermissions.view_support_ticket_responses,
      RawPermissions.create_support_ticket,
      RawPermissions.create_support_ticket_view,
      RawPermissions.send_support_ticket_response_file,
      RawPermissions.delete_support_ticket_response_file,
      RawPermissions.delete_support_ticket_response,
      RawPermissions.delete_support_ticket_view,
      //wallet
      RawPermissions.view_points_wallet,
      RawPermissions.create_points_wallet,
      RawPermissions.create_points_transaction,
      RawPermissions.view_points_wallet_transactions,
      // payslip
      RawPermissions.view_payslip,
      RawPermissions.view_payslip_files,
    ],
    description: "These are permissions for logged_in_users",
  },
  {
    name: PermissionGroups.not_logged_in_users,
    permissions: [
      RawPermissions.view_product,
      RawPermissions.view_event,
      RawPermissions.view_user,
      RawPermissions.view_page_content,
      RawPermissions.view_event,
      RawPermissions.view_category,
      RawPermissions.view_reviews,
    ],
    description: "These are permissions for not_logged_in_users",
  },
];

// Page Groups definition
/**
 * Defines the different groups of pages that users can access based on their permissions.
 * Each group has a name, a list of pages that users in that group can access, and a description.
 */
export const pagesGroups = [
  {
    name: PageGroups.administrator,
    pages: getAllPages(),
    description: "Administrator pages",
  },
  {
    name: PageGroups.moderator,
    pages: [RawPages.announcements, RawPages.support_tickets],
    description: "Moderator pages",
  },
  {
    name: PageGroups.logged_in_users,
    pages: [RawPages.settings],
    description: "Pages for logged_in_users",
  },
  {
    name: PageGroups.not_logged_in_users,
    pages: [],
    description: "Pages for not_logged_in_users",
  },
];

// Refactor functions to use object literals
/**
 * Extracts a set of raw permission types from the provided array of permission types.
 *
 * @param permissionsArr - An array of permission types to extract.
 * @returns A set of raw permission types.
 */
export const getPermissions = (
  permissionsArr: PermissionType[]
): Set<PermissionType> => {
  const extractedPermissions: PermissionType[] = [];

  const extractNestedPermissions = (permission: PermissionType) => {
    const permissionObj = Object.values(Permissions).find(
      (per) => per === permission
    );
    if (permissionObj) {
      // Check if it's a permission group
      const group = permissionsGroups.find((p) => p.name === permissionObj);
      if (group) {
        // Recursively extract permissions from the group
        group.permissions.forEach((perm) => extractNestedPermissions(perm));
      } else {
        // It's a raw permission
        extractedPermissions.push(permissionObj as RawPermissionType);
      }
    }
  };

  // Process each permission
  permissionsArr.forEach((perm) => extractNestedPermissions(perm));

  return new Set(extractedPermissions);
};

/**
 * Extracts a set of raw page types from the provided array of page types.
 *
 * @param pagesArr - An array of page types to extract.
 * @returns A set of raw page types.
 */
export const getPages = (pagesArr: PageType[]): Set<PageType> => {
  const extractedPages: PageType[] = [];

  const extractNestedPages = (page: PageType) => {
    const pageObj = Object.values(Pages).find((p) => p === page);
    if (pageObj) {
      // Check if it's a page group
      const group = pagesGroups.find((p) => p.name === pageObj);
      if (group) {
        // Recursively extract pages from the group
        group.pages.forEach((p) => extractNestedPages(p));
      } else {
        // It's a raw page
        extractedPages.push(pageObj as RawPageType);
      }
    }
  };

  // Process each page
  pagesArr.forEach((page) => extractNestedPages(page));

  return new Set(extractedPages);
};

export const getPermission = async (
  permission: PermissionType
): Promise<PermissionInfo | undefined> => {
  const permissionEnum = Object.values(Permissions).find(
    (p) => p === permission
  );

  if (!permissionEnum) return undefined;

  const group = permissionsGroups.find((p) => p.name === permissionEnum);
  if (group) {
    return {
      name: group.name,
      permissions: group.permissions,
      description: group.description,
    };
  }

  const perm = permissionEnum as RawPermissionType;
  return {
    name: perm,
    description:
      perm in permissionsDescription
        ? permissionsDescription[perm as keyof typeof permissionsDescription]
        : "No description found",
    permissions: [perm],
  };
};

export const getPage = async (
  page: PageType
): Promise<PageInfo | undefined> => {
  const pageEnum = Object.values(Pages).find((p) => p === page);

  if (!pageEnum) return undefined;

  const group = pagesGroups.find((p) => p.name === pageEnum);
  if (group) {
    return {
      name: group.name,
      pages: group.pages,
      description: group.description,
    };
  }

  const pageName = pageEnum as RawPageType;
  return {
    name: pageName,
    description:
      pagesDescription[pageName as keyof typeof pagesDescription] ??
      "No description found",
    pages: [pageName],
  };
};

export function checkProductPermissions(
  sellerId: string | undefined,
  userId: string
): boolean {
  // Check if the user has the required permissions
  if (process.env.SELLER_RESTRICTED) {
    return true;
  } else if (sellerId === userId) {
    return true;
  }

  return false;
}
