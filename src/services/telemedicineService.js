import api from "./api";

// Get all telemedicine consultations
export const getTelemedicines = async (params = {}) => {
  const response = await api.get("/services/telemedicine/", {
    params,
  });

  return response.data;
};

// Get single telemedicine consultation
export const getTelemedicine = async (id) => {
  const response = await api.get(`/services/telemedicine/${id}/`);

  return response.data;
};

// Create telemedicine consultation
export const createTelemedicine = async (data) => {
  const response = await api.post(
    "/services/telemedicine/",
    data
  );

  return response.data;
};

// Update telemedicine consultation
export const updateTelemedicine = async (id, data) => {
  const response = await api.put(
    `/services/telemedicine/${id}/`,
    data
  );

  return response.data;
};

// Partial update
export const patchTelemedicine = async (id, data) => {
  const response = await api.patch(
    `/services/telemedicine/${id}/`,
    data
  );

  return response.data;
};

// Delete telemedicine consultation
export const deleteTelemedicine = async (id) => {
  const response = await api.delete(
    `/services/telemedicine/${id}/`
  );

  return response.data;
};