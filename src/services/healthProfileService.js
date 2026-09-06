import api from "./api";

// Get all health profiles
export const getHealthProfiles = async (params = {}) => {
  const response = await api.get("/health/profiles/", {
    params,
  });

  return response.data;
};

// Get single health profile
export const getHealthProfile = async (id) => {
  const response = await api.get(`/health/profiles/${id}/`);

  return response.data;
};

// Create health profile
export const createHealthProfile = async (data) => {
  const response = await api.post("/health/profiles/", data);

  return response.data;
};

// Update health profile
export const updateHealthProfile = async (id, data) => {
  const response = await api.put(`/health/profiles/${id}/`, data);

  return response.data;
};

// Partial update health profile
export const patchHealthProfile = async (id, data) => {
  const response = await api.patch(`/health/profiles/${id}/`, data);

  return response.data;
};

// Delete health profile
export const deleteHealthProfile = async (id) => {
  const response = await api.delete(`/health/profiles/${id}/`);

  return response.data;
};