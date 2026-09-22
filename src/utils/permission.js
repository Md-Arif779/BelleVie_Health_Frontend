
export const hasPermission = (permissions, moduleName) => {
  if (!permissions || !moduleName) {
    return false;
  }

  return permissions[moduleName] === true;
};

export const canView = (permissions, moduleName) => {
  return hasPermission(permissions, moduleName);
};

export const canAdd = (permissions, moduleName) => {
  return hasPermission(permissions, moduleName);
};

export const canEdit = (permissions, moduleName) => {
  return hasPermission(permissions, moduleName);
};

export const canDelete = (permissions, moduleName) => {
  return hasPermission(permissions, moduleName);
};