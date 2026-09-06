
import api from "./api";

// =====================================================
// ORGANIZATION
// =====================================================

// Get all organizations
export const getOrganizations = async (params = {}) => {
  const response = await api.get("/organizations/", {
    params,
  });

  return response.data;
};

// Get single organization
export const getOrganization = async (id) => {
  const response = await api.get(
    `/organizations/${id}/`
  );

  return response.data;
};

// Create organization
export const createOrganization = async (data) => {
  const response = await api.post(
    "/organizations/",
    data
  );

  return response.data;
};

// Update organization
export const updateOrganization = async (id, data) => {
  const response = await api.put(
    `/organizations/${id}/`,
    data
  );

  return response.data;
};

// Partial update organization
export const patchOrganization = async (id, data) => {
  const response = await api.patch(
    `/organizations/${id}/`,
    data
  );

  return response.data;
};

// Delete organization
export const deleteOrganization = async (id) => {
  const response = await api.delete(
    `/organizations/${id}/`
  );

  return response.data;
};

