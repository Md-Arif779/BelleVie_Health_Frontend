import api from "./api";

// Get all health cards
export const getHealthCards = async (params = {}) => {
  const response = await api.get("/health/", {
    params,
  });

  return response.data;
};

// Get single health card
export const getHealthCard = async (id) => {
  const response = await api.get(`/health/${id}/`);

  return response.data;
};

// Create health card
export const createHealthCard = async (data) => {
  const response = await api.post("/health/", data);

  return response.data;
};

// Update health card
export const updateHealthCard = async (id, data) => {
  const response = await api.put(`/health/${id}/`, data);

  return response.data;
};

// Partial update health card
export const patchHealthCard = async (id, data) => {
  const response = await api.patch(`/health/${id}/`, data);

  return response.data;
};

// Delete health card
export const deleteHealthCard = async (id) => {
  const response = await api.delete(`/health/${id}/`);

  return response.data;
};