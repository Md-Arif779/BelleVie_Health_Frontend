
/**
 * Check granular module permissions
 *
 * permissions example:
 *
 * {
 *   members: {
 *     can_view: true,
 *     can_add: true,
 *     can_edit: false,
 *     can_delete: false
 *   },
 *   doctors: {
 *     can_view: true,
 *     can_add: false,
 *     can_edit: false,
 *     can_delete: false
 *   }
 * }
 *
 * @param {Object} permissions
 * @param {string} moduleName
 * @param {string} action
 * @returns {boolean}
 */
export const hasPermission = (
  permissions,
  moduleName,
  action
) => {
  if (!permissions || !moduleName || !action) {
    return false;
  }

  const modulePermission = permissions[moduleName];

  if (!modulePermission) {
    return false;
  }

  return Boolean(modulePermission[action]);
};


/**
 * Check View Permission
 */
export const canView = (
  permissions,
  moduleName
) => {
  return hasPermission(
    permissions,
    moduleName,
    "can_view"
  );
};


/**
 * Check Add Permission
 */
export const canAdd = (
  permissions,
  moduleName
) => {
  return hasPermission(
    permissions,
    moduleName,
    "can_add"
  );
};


/**
 * Check Edit Permission
 */
export const canEdit = (
  permissions,
  moduleName
) => {
  return hasPermission(
    permissions,
    moduleName,
    "can_edit"
  );
};


/**
 * Check Delete Permission
 */
export const canDelete = (
  permissions,
  moduleName
) => {
  return hasPermission(
    permissions,
    moduleName,
    "can_delete"
  );
};

