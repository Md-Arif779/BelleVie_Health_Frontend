import api from "./api";

export const getHealthPlans = async (params = {}) => {
  const response = await api.get("/health/plans/", { params });
  return response.data;
};

export const getHealthPlan = async (id) => {
  const response = await api.get(`/health/plans/${id}/`);
  return response.data;
};

export const createHealthPlan = async (data) => {
  const response = await api.post("/health/plans/", data);
  return response.data;
};

export const updateHealthPlan = async (id, data) => {
  const response = await api.put(`/health/plans/${id}/`, data);
  return response.data;
};

export const patchHealthPlan = async (id, data) => {
  const response = await api.patch(`/health/plans/${id}/`, data);
  return response.data;
};

export const deleteHealthPlan = async (id) => {
  const response = await api.delete(`/health/plans/${id}/`);
  return response.data;
};