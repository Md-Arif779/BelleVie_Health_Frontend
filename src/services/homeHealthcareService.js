
import api from "./api";

// Get all home healthcare services
export const getHomeHealthcareServices = async (params = {}) => {
  const response = await api.get("/services/home-healthcare/", {
    params,
  });

  return response.data;
};

// Get single home healthcare service
export const getHomeHealthcareService = async (id) => {
  const response = await api.get(
    `/services/home-healthcare/${id}/`
  );

  return response.data;
};

// Create home healthcare service
export const createHomeHealthcareService = async (data) => {
  const response = await api.post(
    "/services/home-healthcare/",
    data
  );

  return response.data;
};

// Update home healthcare service
export const updateHomeHealthcareService = async (id, data) => {
  const response = await api.put(
    `/services/home-healthcare/${id}/`,
    data
  );

  return response.data;
};

// Partial update
export const patchHomeHealthcareService = async (id, data) => {
  const response = await api.patch(
    `/services/home-healthcare/${id}/`,
    data
  );

  return response.data;
};

// Delete home healthcare service
export const deleteHomeHealthcareService = async (id) => {
  const response = await api.delete(
    `/services/home-healthcare/${id}/`
  );

  return response.data;
};

