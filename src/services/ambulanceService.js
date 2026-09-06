import api from "./api";

/**
 * Get all ambulance requests
 */
export const getAmbulanceRequests = async (params = {}) => {
  const response = await api.get(
    "/ambulance/requests/",
    { params }
  );

  return response.data;
};

/**
 * Get single ambulance request
 */
export const getAmbulanceRequest = async (id) => {
  const response = await api.get(
    `/ambulance/requests/${id}/`
  );

  return response.data;
};

/**
 * Create ambulance request
 */
export const createAmbulanceRequest = async (data) => {
  const response = await api.post(
    "/ambulance/requests/",
    data
  );

  return response.data;
};

/**
 * Update ambulance request
 */
export const updateAmbulanceRequest = async (
  id,
  data
) => {
  const response = await api.put(
    `/ambulance/requests/${id}/`,
    data
  );

  return response.data;
};

/**
 * Delete ambulance request
 */
export const deleteAmbulanceRequest = async (id) => {
  const response = await api.delete(
    `/ambulance/requests/${id}/`
  );

  return response.data;
};